import confirmationHtml from "../assets/emails/Confirmation.html?raw";
import passwordResetHtml from "../assets/emails/PasswordReset.html?raw";
import sharedDocumentHtml from "../assets/emails/SharedDocument.html?raw";
import invoiceReadyHtml from "../assets/emails/InvoiceReady.html?raw";
import cryptoWalletHtml from "../assets/emails/CryptoWalletAlert.html?raw";

export const EMAILS = [
  {
    id: "shared_doc",
    subject: "A document has been shared with you",
    fromName: "Docs",
    fromEmail: "James@University.ac.uk",
    time: "09:14",
    html: sharedDocumentHtml,
    groundTruth: "real",
  },
  {
    id: "confirmation",
    subject: "Confirm your email",
    fromName: "Account Team",
    fromEmail: "Jane@Acounts.com",
    time: "10:02",
    html: confirmationHtml,
    groundTruth: "phish",
  },
  {
    id: "password_reset",
    subject: "Reset your password",
    fromName: "Account Security",
    fromEmail: "It@Securtiy.com",
    time: "11:27",
    html: passwordResetHtml,
    groundTruth: "phish",
  },
  {
    id: "invoice_ready",
    subject: "Your invoice is ready",
    fromName: "Billing",
    fromEmail: "billing@Finances.com",
    time: "14:18",
    html: invoiceReadyHtml,
    groundTruth: "real",
  },
  {
  id: "crypto_wallet_alert",
  subject: "Unusual sign-in attempt detected",
  fromName: "SecureChain Wallet",
  fromEmail: "security@securechain-walet.com",
  time: "19:42",
  html: cryptoWalletHtml,
  groundTruth: "phish",
},

];


