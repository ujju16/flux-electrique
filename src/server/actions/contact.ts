"use server";

import { render } from "@react-email/components";
import DOMPurify from "isomorphic-dompurify";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import ContactTemplate from "@/components/email/ContactTemplate";
import { prisma } from "@/lib/prisma";
import type {
  BudgetRange,
  ServiceType,
} from "../../../generated/prisma/client";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation Schema
const contactSchema = z.object({
  type: z.enum([
    "HARDWARE_REPAIR",
    "SOFTWARE_DEV",
    "DEVSECOPS_CONSULTING",
    "OTHER",
  ]),
  designation: z
    .string()
    .min(5, "La désignation doit contenir au moins 5 caractères")
    .max(200, "La désignation ne peut pas dépasser 200 caractères"),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100),
  email: z.string().email("Email invalide").max(100),
  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Format de téléphone invalide",
    )
    .optional()
    .or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  message: z
    .string()
    .min(20, "Le message doit contenir au moins 20 caractères")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
  budget: z.enum([
    "UNKNOWN",
    "LESS_THAN_500",
    "FROM_500_TO_2K",
    "FROM_2K_TO_10K",
    "MORE_THAN_10K",
  ]),
  _honey: z.string().optional(), // Honeypot field
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactState = {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof ContactFormData]?: string[];
  };
};

/**
 * Check rate limit: Max 3 requests per hour from same IP
 */
async function checkRateLimit(ipAddress: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentRequests = await prisma.contactRequest.count({
    where: {
      ipAddress,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });

  return recentRequests < 3;
}

/**
 * Get client IP address from headers
 */
function getClientIp(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Server Action: Submit Contact Form
 */
export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  try {
    // Get client IP
    const headersList = await headers();
    const ipAddress = getClientIp(headersList);

    // Extract form data
    const rawData = {
      type: formData.get("type") as string,
      designation: formData.get("designation") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
      budget: formData.get("budget") as string,
      _honey: formData.get("_honey") as string,
    };

    // Security Layer 2: Honeypot Check
    if (rawData._honey) {
      // Silent rejection - fake success to fool bots
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        message:
          "Votre demande a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.",
      };
    }

    // Security Layer 1: Rate Limiting
    const canProceed = await checkRateLimit(ipAddress);
    if (!canProceed) {
      return {
        success: false,
        message:
          "Trop de demandes depuis votre adresse IP. Veuillez réessayer dans 1 heure.",
      };
    }

    // Security Layer 3: Zod Validation
    const validationResult = contactSchema.safeParse(rawData);
    if (!validationResult.success) {
      const errors: { [key: string]: string[] } = {};
      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(issue.message);
      }
      return {
        success: false,
        message: "Veuillez corriger les erreurs dans le formulaire.",
        errors,
      };
    }

    const validated = validationResult.data;

    // Security Layer 4: Sanitize HTML inputs
    const sanitizedData = {
      ...validated,
      designation: DOMPurify.sanitize(validated.designation, {
        ALLOWED_TAGS: [],
      }),
      message: DOMPurify.sanitize(validated.message, { ALLOWED_TAGS: [] }),
      company: validated.company
        ? DOMPurify.sanitize(validated.company, { ALLOWED_TAGS: [] })
        : undefined,
    };

    // Save to Database
    const contactRequest = await prisma.contactRequest.create({
      data: {
        type: sanitizedData.type as ServiceType,
        designation: sanitizedData.designation,
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || null,
        company: sanitizedData.company || null,
        message: sanitizedData.message,
        budget: sanitizedData.budget as BudgetRange,
        ipAddress,
        status: "NEW",
      },
    });

    // Render Email Template
    const emailHtml = await render(
      ContactTemplate({
        type: contactRequest.type,
        designation: contactRequest.designation,
        name: contactRequest.name,
        email: contactRequest.email,
        phone: contactRequest.phone || undefined,
        company: contactRequest.company || undefined,
        message: contactRequest.message,
        budget: contactRequest.budget,
        ipAddress,
      }),
    );

    // Send Email via Resend
    const emailResult = await resend.emails.send({
      from: process.env.SENDER_EMAIL || "noreply@fluxelectrique.com",
      to: process.env.CONTACT_EMAIL || "contact@fluxelectrique.com",
      replyTo: contactRequest.email,
      subject: `[${contactRequest.type}] ${contactRequest.designation}`,
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      // Still return success since data is saved
      return {
        success: true,
        message:
          "Votre demande a été enregistrée. Nous vous répondrons dans les plus brefs délais.",
      };
    }

    return {
      success: true,
      message:
        "Votre demande a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message:
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.",
    };
  }
}
