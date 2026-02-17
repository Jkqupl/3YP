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
    feedback: {
      correct: {
        title: "Correct: this one looks legitimate",
        message: "Nothing is forcing urgency here, and the sender domain looks consistent with the context.",
        bullets: [
          "Sender domain matches a plausible organisation (University.ac.uk).",
          "Wording is neutral, not threatening or overly urgent.",
          "No obvious spelling mistakes or weird branding.",
        ],
      },
      incorrect: {
        title: "Not quite: what made this look safe?",
        message: "Before flagging a share request, quickly sanity-check the sender and wording.",
        bullets: [
          "Does the sender/domain look official for the situation?",
          "Are there any spelling mistakes or odd phrasing?",
          "Is the tone normal, or is it pushing urgency and fear?",
        ],
      },
    },
  },

  {
    id: "confirmation",
    subject: "Confirm your email",
    fromName: "Account Team",
    fromEmail: "Jane@Acounts.com",
    time: "10:02",
    html: confirmationHtml,
    groundTruth: "phish",
    feedback: {
      correct: {
        title: "Correct: phishing indicators spotted",
        message: "Good call, this message has multiple trust breaks.",
        bullets: [
          "Sender domain looks wrong (typo style: “Acounts”).",
          "The button link domain does not look like the real company domain.",
          "Generic wording and a pushy call-to-action without context.",
        ],
      },
      incorrect: {
        title: "Not quite: this is likely phishing",
        message: "Two quick checks would have helped here.",
        bullets: [
          "Double-check the sender’s email for typos or odd domains.",
          "Does the website the button leads to look official?",
          "Is the email too generic for something security-related?",
        ],
      },
    },
  },

  {
    id: "password_reset",
    subject: "Reset your password",
    fromName: "Account Security",
    fromEmail: "It@Securtiy.com",
    time: "11:27",
    html: passwordResetHtml,
    groundTruth: "phish",
    feedback: {
      correct: {
        title: "Correct: that reset email is dodgy",
        message: "Nice catch, the sender details are a giveaway.",
        bullets: [
          "Spelling errors in the sender domain (eg “Securtiy”).",
          "Security emails should come from a consistent official domain.",
          "The link destination is not clearly tied to the real service.",
        ],
      },
      incorrect: {
        title: "Not quite: check the sender carefully",
        message: "Password resets are common bait.",
        bullets: [
          "Check the spelling of the sender’s email and domain.",
          "If it’s real, it usually references your account or recent action.",
          "Hover or preview the link to see if it matches the service domain.",
        ],
      },
    },
  },

  {
    id: "invoice_ready",
    subject: "Your invoice is ready",
    fromName: "Billing",
    fromEmail: "billing@Finances.com",
    time: "14:18",
    html: invoiceReadyHtml,
    groundTruth: "real",
    feedback: {
      correct: {
        title: "Correct: this looks like a normal invoice notice",
        message: "Good judgement. It even suggests a safer behaviour.",
        bullets: [
          "Tone is calm, not threatening.",
          "It suggests going to the official site yourself (good security practice).",
          "No obvious domain trickery or urgent pressure tactics.",
        ],
      },
      incorrect: {
        title: "Not quite: why this could be safe",
        message: "Invoice emails can be risky, but this one has some green flags.",
        bullets: [
          "Does the PDF (or invoice reference) look consistent and not random?",
          "They advise you to access their website yourself instead of pushing a link.",
          "No urgency like “account locked” or “final notice” language.",
        ],
      },
    },
  },

  {
    id: "crypto_wallet_alert",
    subject: "Unusual sign-in attempt detected",
    fromName: "SecureChain Wallet",
    fromEmail: "security@securechain-walet.com",
    time: "19:42",
    html: cryptoWalletHtml,
    groundTruth: "phish",
    feedback: {
      correct: {
        title: "Correct: classic urgent-crypto phishing",
        message: "Great spot. These rely on fear and rushed clicks.",
        bullets: [
          "Domain typo: “walet” instead of “wallet”.",
          "Aggressive, urgent wording designed to panic you.",
          "Link destination does not match a trustworthy official domain.",
        ],
      },
      incorrect: {
        title: "Not quite: red flags you missed",
        message: "Crypto alerts are a common scam theme.",
        bullets: [
          "Have they spelled everything correctly (brand + domain)?",
          "They’re using very aggressive/urgent wording to rush you.",
          "Always preview the link domain before clicking.",
        ],
      },
    },
  },
];
