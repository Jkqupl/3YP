import confirmationHtml from "../assets/emails/Confirmation.html?raw";
import passwordResetHtml from "../assets/emails/PasswordReset.html?raw";
import sharedDocumentHtml from "../assets/emails/SharedDocument.html?raw";
import invoiceReadyHtml from "../assets/emails/InvoiceReady.html?raw";

export const EMAILS = [
  {
    id: "confirmation",
    subject: "Confirm your email",
    fromName: "Account Team",
    fromEmail: "no-reply@style-casual.com",
    time: "09:14",
    html: confirmationHtml,
    groundTruth: "phish",
  },
  {
    id: "password_reset",
    subject: "Reset your password",
    fromName: "Account Security",
    fromEmail: "security@style-casual.com",
    time: "10:02",
    html: passwordResetHtml,
    groundTruth: "phish",
  },
  {
    id: "shared_doc",
    subject: "A document has been shared with you",
    fromName: "Docs",
    fromEmail: "share@style-casual.com",
    time: "11:27",
    html: sharedDocumentHtml,
    groundTruth: "phish",
  },
  {
    id: "invoice_ready",
    subject: "Your invoice is ready",
    fromName: "Billing",
    fromEmail: "billing@style-casual.com",
    time: "14:18",
    html: invoiceReadyHtml,
    groundTruth: "grey",
  },
];


