import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "form",

    handler: async (formData) => {
      // Extraer los datos del formulario
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      // Validar que los datos estén presentes
      if (!name || !email || !message) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Todos los campos son requeridos: name, email, message",
        });
      }

      // Enviar el correo electrónico con los datos del formulario
      const { data, error } = await resend.emails.send({
        from: `${name} <onboarding@resend.dev>`, // Usa un dominio personalizado
        to: ["federico200@hotmail.com"], // Usar el email proporcionado en el formulario
        subject: `Mensaje de ${name} - Desde el formulario de contacto`,
        html: `<strong>Nombre:</strong> ${name} <br /> <strong>Email:</strong> ${email} <br /> <strong>Mensaje:</strong> <br /> ${message}`,
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`, // Versión en texto plano
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
    },
  }),
};