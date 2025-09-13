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
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Validate contact form data
 */
export function validateContactForm(data: any): { isValid: boolean; errors?: string[] } {
  try {
    // This could be expanded with more complex validation logic
    const errors: string[] = [];

    if (!data.firstName || data.firstName.length < 2) {
      errors.push("Le prénom doit contenir au moins 2 caractères");
    }

    if (!data.lastName || data.lastName.length < 2) {
      errors.push("Le nom doit contenir au moins 2 caractères");
    }

    if (!data.email || !data.email.includes("@")) {
      errors.push("Veuillez entrer une adresse email valide");
    }

    if (!data.subject || data.subject.length < 5) {
      errors.push("Le sujet doit contenir au moins 5 caractères");
    }

    if (!data.message || data.message.length < 10) {
      errors.push("Le message doit contenir au moins 10 caractères");
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
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
