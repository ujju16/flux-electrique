"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// 1. Schéma de validation Zod (Sécurité)
const contactSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  type: z.enum([
    "HARDWARE_REPAIR",
    "SOFTWARE_DEV",
    "DEVSECOPS_CONSULTING",
    "OTHER",
  ]),
  designation: z
    .string()
    .min(3, "La désignation est requise (ex: Modèle appareil)"),
  budget: z.enum([
    "UNKNOWN",
    "LESS_THAN_500",
    "FROM_500_TO_2K",
    "FROM_2K_TO_10K",
    "MORE_THAN_10K",
  ]),
  message: z.string().min(10, "Merci de détailler un peu plus votre besoin"),
});

// 2. State definition pour React 19 useActionState
export type ContactState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// 3. L'Action
export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Extraction des données brutes
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    type: formData.get("type"),
    designation: formData.get("designation"),
    budget: formData.get("budget"),
    message: formData.get("message"),
  };

  // Validation
  const validated = contactSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Veuillez corriger les erreurs du formulaire.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Insertion en BDD via Prisma
    await prisma.contactRequest.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone || null,
        company: validated.data.company || null,
        type: validated.data.type,
        designation: validated.data.designation,
        budget: validated.data.budget,
        message: validated.data.message,
      },
    });

    // TODO: Ici, tu pourrais ajouter l'envoi d'un email (Resend, SendGrid, etc.)

    revalidatePath("/contact");
    return {
      success: true,
      message: "Demande reçue ! Nous vous recontactons sous 24h.",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Une erreur technique est survenue." };
  }
}
