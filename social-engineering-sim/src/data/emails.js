import confirmationHtml from "../assets/emails/Confirmation.html?raw";
import passwordResetHtml from "../assets/emails/PasswordReset.html?raw";
import sharedDocumentHtml from "../assets/emails/SharedDocument.html?raw";
import invoiceReadyHtml from "../assets/emails/InvoiceReady.html?raw";
import cryptoWalletHtml from "../assets/emails/CryptoWalletAlert.html?raw";
import itSurveyHtml from "../assets/emails/ITSurvey.html?raw";
import hrSurveyPhishHtml from "../assets/emails/HRSurveyPhish.html?raw";
import softwareUpdatePhishHtml from "../assets/emails/SoftwareUpdatePhish.html?raw";
import parcelDeliveryHtml from "../assets/emails/ParcelDelivery.html?raw";
import prizeWinnerPhishHtml from "../assets/emails/PrizeWinnerPhish.html?raw";
import bankStatementHtml from "../assets/emails/BankStatement.html?raw";
import itAuditPhishHtml from "../assets/emails/ITAuditPhish.html?raw";

export const EMAILS = [
  // ─── REAL ────────────────────────────────────────────────────────────────────

  {
    id: "shared_doc",
    subject: "A document has been shared with you",
    fromName: "Docs",
    fromEmail: "james.riley@university.ac.uk",
    time: "09:14",
    html: sharedDocumentHtml,
    groundTruth: "real",
    feedback: {
      correct: {
        title: "Correct — this one looks legitimate",
        message: "Good call. Nothing here is trying to pressure or deceive you.",
        bullets: [
          "Sender domain is a real institutional address (university.ac.uk).",
          "Wording is neutral — no urgency, no threats, no prizes.",
          "The request makes sense: someone sharing a document is a normal event.",
        ],
      },
      incorrect: {
        title: "Not quite — this one is probably safe",
        message: "A share notification from a recognisable domain is usually fine to investigate.",
        bullets: [
          "Check: does the sender domain match the organisation they claim to be from?",
          "Is there any urgency or threat pushing you to act quickly?",
          "If unsure, contact the sender directly rather than clicking.",
        ],
      },
    },
  },

  {
    id: "bank_statement",
    subject: "Your November statement is ready",
    fromName: "CrestBank",
    fromEmail: "statements@crestbank.co.uk",
    time: "08:02",
    html: bankStatementHtml,
    groundTruth: "real",
    feedback: {
      correct: {
        title: "Correct — a legitimate bank notification",
        message: "Well spotted. This email follows the pattern of a trustworthy bank communication.",
        bullets: [
          "The sender domain matches the bank name exactly (crestbank.co.uk).",
          "It explicitly tells you NOT to share passwords — real banks do this.",
          "Instead of attaching a file, it directs you to log in at their official site.",
          "No pressure, no countdown, no threats about suspended accounts.",
        ],
      },
      incorrect: {
        title: "Not quite — this is a safe email",
        message: "Bank emails can look suspicious, but this one has several trustworthy signals.",
        bullets: [
          "Real banks never attach statement files — they direct you to log in yourself.",
          "Real banks remind you they will never ask for your PIN or password.",
          "The sender domain (crestbank.co.uk) matches the brand with no alterations.",
        ],
      },
    },
  },

  {
    id: "parcel_delivery",
    subject: "Your parcel is out for delivery today",
    fromName: "SwiftPost",
    fromEmail: "notifications@swiftpost.co.uk",
    time: "08:47",
    html: parcelDeliveryHtml,
    groundTruth: "real",
    feedback: {
      correct: {
        title: "Correct — this delivery notification looks genuine",
        message: "Good judgement. The signals here point to a real notification.",
        bullets: [
          "Sender domain (swiftpost.co.uk) is consistent with the brand name.",
          "The tracking link destination matches: track.swiftpost.co.uk.",
          "No requests for payment, personal details, or login credentials.",
        ],
      },
      incorrect: {
        title: "Not quite — this delivery email is legitimate",
        message: "Delivery notifications are common phishing bait, but this one has clean signals.",
        bullets: [
          "Does the sender domain match the courier brand exactly?",
          "Does the tracking link use the same domain as the sender?",
          "Is anything being asked of you beyond tracking your parcel?",
        ],
      },
    },
  },

  {
    id: "it_survey",
    subject: "Quick feedback on your recent IT support request",
    fromName: "University IT Services",
    fromEmail: "support@itservices.university.ac.uk",
    time: "11:05",
    html: itSurveyHtml,
    groundTruth: "real",
    feedback: {
      correct: {
        title: "Correct — a routine post-support survey",
        message: "This looks like a standard satisfaction survey. The context makes it credible.",
        bullets: [
          "References a specific ticket number (ITS-20847) — not a generic mass email.",
          "The sender domain matches the organisation (itservices.university.ac.uk).",
          "Survey link points to the same domain as the sender.",
          "The survey is described as optional — no threat if you don't respond.",
        ],
      },
      incorrect: {
        title: "Not quite — this survey is legitimate",
        message: "Post-support surveys are a normal part of IT service management.",
        bullets: [
          "Does the email reference a specific interaction you actually had?",
          "Does the survey link match the organisation's domain?",
          "Is the survey optional, or is there a threat if you don't complete it?",
        ],
      },
    },
  },

  // ─── PHISHING ────────────────────────────────────────────────────────────────

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
        title: "Correct — phishing indicators spotted",
        message: "Good catch. This message has several obvious trust breaks.",
        bullets: [
          "Sender domain has a typo: 'Acounts' instead of 'Accounts'.",
          "The button link goes to a random, unrelated domain.",
          "No context — which account? Real confirmations are always specific.",
        ],
      },
      incorrect: {
        title: "Not quite — this is likely phishing",
        message: "A few quick checks would have flagged this.",
        bullets: [
          "Always check the sender's email for typos (here: 'Acounts.com').",
          "Hover the button — does the link domain look like an official site?",
          "Ask: which account is this for? Legitimate emails always say.",
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
        title: "Correct — this reset email is suspicious",
        message: "Nice catch. The sender details give it away immediately.",
        bullets: [
          "Sender domain has a spelling error: 'Securtiy' instead of 'Security'.",
          "No mention of which service the password reset is for.",
          "You didn't request a reset — unsolicited resets are a red flag.",
        ],
      },
      incorrect: {
        title: "Not quite — check the sender carefully",
        message: "Password reset emails are a very common phishing lure.",
        bullets: [
          "Typos in the sender domain ('Securtiy.com') are a clear red flag.",
          "Real reset emails always specify which service they're from.",
          "If you didn't request a reset, treat the email as suspicious by default.",
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
        title: "Correct — classic urgent crypto phishing",
        message: "Great spot. Fear and urgency are the entire mechanism here.",
        bullets: [
          "Domain typo: 'walet' instead of 'wallet' — securechain-walet.com.",
          "The link URL is a gibberish domain with no connection to a real service.",
          "Aggressive language ('your assets may be at risk') is designed to panic you.",
        ],
      },
      incorrect: {
        title: "Not quite — red flags you may have missed",
        message: "Crypto-themed alerts rely entirely on fear of losing money.",
        bullets: [
          "Check the domain carefully: 'securechain-walet.com' has a typo.",
          "Extremely urgent language is designed to stop you thinking critically.",
          "Always navigate to your wallet directly rather than following email links.",
        ],
      },
    },
  },

  {
    id: "hr_survey_phish",
    subject: "Annual Employee Wellbeing Survey — closes Friday",
    fromName: "People & Culture Team",
    fromEmail: "hr@people-engagement.co",
    time: "09:31",
    html: hrSurveyPhishHtml,
    groundTruth: "phish",
    feedback: {
      correct: {
        title: "Correct — this survey is a phishing attempt",
        message: "Well spotted. This attack uses curiosity and incentive rather than fear.",
        bullets: [
          "The sender domain (people-engagement.co) doesn't match your organisation's domain.",
          "A prize draw incentive is a classic tactic to lower suspicion and increase click rates.",
          "The survey link uses a third-party domain that has nothing to do with a real HR team.",
          "Asking for 'personal preference questions' in a staff survey signals data harvesting.",
        ],
      },
      incorrect: {
        title: "Not quite — this survey is a phishing attempt",
        message: "This one is harder to spot because it uses engagement rather than urgency.",
        bullets: [
          "Does the sender domain match your actual employer's email domain?",
          "Prize incentives in internal surveys are unusual — they deliberately lower your guard.",
          "The survey link should point to your organisation's own domain, not a third-party one.",
        ],
      },
    },
  },

  {
    id: "software_update_phish",
    subject: "NexusDrive update available — version 4.2.1",
    fromName: "NexusDrive",
    fromEmail: "updates@nexusdrive-notifications.net",
    time: "14:52",
    html: softwareUpdatePhishHtml,
    groundTruth: "phish",
    feedback: {
      correct: {
        title: "Correct — this update email is malware bait",
        message: "Software update emails that push direct .exe downloads are a major malware vector.",
        bullets: [
          "Sender domain (nexusdrive-notifications.net) differs from the brand's real domain.",
          "The download link goes to nexusdrive-update.net — a separate, unrelated domain.",
          "Legitimate software updates come through the application itself, never email links.",
          "Downloading .exe files from emails is one of the most common malware infection routes.",
        ],
      },
      incorrect: {
        title: "Not quite — this is a malicious download attempt",
        message: "Software update emails are a major delivery mechanism for malware.",
        bullets: [
          "Real updates happen through the app itself — not email download links.",
          "Does the download domain match the official brand domain exactly?",
          "Never run .exe files delivered by email, even if the email looks professional.",
        ],
      },
    },
  },

  {
    id: "prize_winner_phish",
    subject: "You've been selected — claim your prize",
    fromName: "National Consumer Rewards",
    fromEmail: "winners@ncr-rewards.co",
    time: "16:07",
    html: prizeWinnerPhishHtml,
    groundTruth: "phish",
    feedback: {
      correct: {
        title: "Correct — this is a prize scam",
        message: "Unexpected prize notifications are almost always credential or payment harvesting scams.",
        bullets: [
          "You didn't enter any competition — unsolicited wins don't happen.",
          "The countdown timer is artificial urgency designed to prevent rational thinking.",
          "The claim URL (ncr-prize-claim.co) is a throwaway domain with no traceable organisation.",
          "Asking for 'delivery details' is cover for harvesting personal and payment information.",
        ],
      },
      incorrect: {
        title: "Not quite — this is a classic prize scam",
        message: "These emails appeal to excitement rather than create fear.",
        bullets: [
          "Ask yourself: did you actually enter this competition?",
          "Countdown timers and limited claim windows are pressure tactics, not real deadlines.",
          "Search the organisation name independently — scam domains have no traceable history.",
        ],
      },
    },
  },

  {
    id: "it_audit_phish",
    subject: "Action Required: Security compliance verification",
    fromName: "IT Security & Compliance",
    fromEmail: "audit@it-compliance-portal.systems",
    time: "08:19",
    html: itAuditPhishHtml,
    groundTruth: "phish",
    feedback: {
      correct: {
        title: "Correct — internal IT impersonation",
        message: "Excellent catch. This is one of the hardest phishing types to spot.",
        bullets: [
          "Sender domain (it-compliance-portal.systems) is not your organisation's domain.",
          "Real IT teams never ask you to confirm login credentials via an email link.",
          "The verification link goes to a third-party domain, not an internal system.",
          "Threatening account suspension unless you act immediately is a classic pressure tactic.",
        ],
      },
      incorrect: {
        title: "Not quite — this IT audit email is phishing",
        message: "This attack impersonates internal IT authority — one of the most effective techniques.",
        bullets: [
          "Your IT team emails from your organisation's domain — not it-compliance-portal.systems.",
          "No legitimate IT process requires you to confirm your password via an email link.",
          "When in doubt, call the IT service desk on their known number rather than clicking.",
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
        title: "Correct — this looks like a normal invoice notice",
        message: "Good judgement. It even demonstrates a safer practice.",
        bullets: [
          "Tone is calm — no threats or urgency.",
          "It suggests accessing the official site yourself rather than just pushing a link.",
          "No domain trickery or account lockout pressure.",
        ],
      },
      incorrect: {
        title: "Not quite — why this could be safe",
        message: "Invoice emails can be risky, but this one has some green flags.",
        bullets: [
          "Does the PDF reference look consistent rather than random?",
          "The email advises you to access their website yourself — that's good security practice.",
          "No urgency like 'account locked' or 'final notice' language.",
        ],
      },
    },
  },
];