import nodemailer from "nodemailer";

/*
  Shared Gmail SMTP setup for the contact form and the free-tool lead
  capture endpoint. Same env vars as documented in app/api/contact/route.ts:
    GMAIL_USER          = contact@mlinx.studio  (sends the mail)
    GMAIL_APP_PASSWORD  = 16-char Google App Password
    CONTACT_TO          = where leads land (defaults to GMAIL_USER)
*/
export function getMailEnv() {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
  return { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO };
}

export function createMailTransporter(user: string, pass: string) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}
