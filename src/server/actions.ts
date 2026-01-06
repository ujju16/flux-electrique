"use server";

import { z } from "zod";

/**
 * Contact form schema with Zod validation
 */
const contactFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Server Action: Submit contact form
 */
export async function submitContactForm(data: ContactFormData) {
  try {
    const validated = contactFormSchema.parse(data);

    // TODO: Implement email notification
    // TODO: Store in database if needed

    console.log("Contact form submission:", validated);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
          code: issue.code,
        })),
      };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}
