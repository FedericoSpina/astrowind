/* import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "form",
    handler: async (formData) => {
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      if (!name || !email || !message) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Todos los campos son requeridos",
        });
      }

      const { error } = await resend.emails.send({
        from: `${name} <onboarding@resend.dev>`,
        to: ["federico200@hotmail.com"],
        subject: `Mensaje de ${name} desde el formulario`,
        html: `<strong>Nombre:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Mensaje:</strong><br/>${message}`,
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return { success: true };
    },
  }),
};
 */