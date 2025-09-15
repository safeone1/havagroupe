import { ContactFormSchemaType } from "@/lib/Schema";

/**
 * Submit contact form data to the API
 */
export async function submitContactForm(data: ContactFormSchemaType) {
  try {
    const response = await fetch('/api/contact', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erreur lors de l'envoi du message");
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error: unknown) {
    console.error("Failed to send contact form:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }
}

/**
 * Validate contact form data
 */
export function validateContactForm(data: Record<string, unknown>): { isValid: boolean; errors?: string[] } {
  try {
    // This could be expanded with more complex validation logic
    const errors: string[] = [];

    const firstName = typeof data.firstName === 'string' ? data.firstName : '';
    const lastName = typeof data.lastName === 'string' ? data.lastName : '';
    const email = typeof data.email === 'string' ? data.email : '';
    const subject = typeof data.subject === 'string' ? data.subject : '';
    const message = typeof data.message === 'string' ? data.message : '';

    if (!firstName || firstName.length < 2) {
      errors.push("Le prénom doit contenir au moins 2 caractères");
    }

    if (!lastName || lastName.length < 2) {
      errors.push("Le nom doit contenir au moins 2 caractères");
    }

    if (!email || !email.includes("@")) {
      errors.push("Veuillez entrer une adresse email valide");
    }

    if (!subject || subject.length < 5) {
      errors.push("Le sujet doit contenir au moins 5 caractères");
    }

    if (!message || message.length < 10) {
      errors.push("Le message doit contenir au moins 10 caractères");
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch {
    return {
      isValid: false,
      errors: ["Erreur de validation"],
    };
  }
}

/**
 * Get contact information
 */
export function getContactInfo() {
  return {
    address: {
      street: "Zone Industrielle",
      city: "Casablanca",
      country: "Maroc",
      full: "Casablanca, Maroc"
    },
    phone: {
      display: "+212 6 00 00 00 00",
      link: "tel:+212600000000"
    },
    email: {
      display: "contact@hava.ma",
      link: "mailto:contact@hava.ma"
    },
    hours: {
      weekdays: "Lun - Ven: 8h00 - 18h00",
      saturday: "Sam: 8h00 - 14h00",
      sunday: "Dim: Fermé"
    },
    response: {
      time: "24 heures",
      description: "Nous répondons généralement sous 24h"
    }
  };
}
