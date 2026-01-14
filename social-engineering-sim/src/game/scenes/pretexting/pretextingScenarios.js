const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const OPTIONS = {
  identity: [
    { id: "it_support", label: "IT support", tags: ["authority"] },
    { id: "building_mgmt", label: "Building management", tags: ["authority"] },
    { id: "delivery", label: "Delivery company", tags: ["familiar"] },
    { id: "event_staff", label: "Event organiser", tags: ["authority"] },
    { id: "colleague", label: "Colleague", tags: ["familiar"] },
    { id: "contractor", label: "External contractor", tags: ["neutral"] }
  ],
  context: [
    { id: "specific_ticket", label: "Provides a ticket number and department name", tags: ["credible"] },
    { id: "specific_location", label: "Mentions a real location and a routine process", tags: ["credible"] },
    { id: "vague_system", label: "Mentions a system vaguely with no specifics", tags: ["vague"] },
    { id: "name_drop", label: "Name drops a manager", tags: ["authority_boost"] },
    { id: "wrong_detail", label: "Includes a detail that does not match the environment", tags: ["contradiction"] }
  ],
  emotion: [
    { id: "neutral", label: "Neutral and calm", tags: ["neutral"] },
    { id: "urgency", label: "Urgency and time pressure", tags: ["pressure"] },
    { id: "authority", label: "Authority and confidence", tags: ["pressure", "authority"] },
    { id: "sympathy", label: "Sympathy and personal appeal", tags: ["pressure"] },
    { id: "fear", label: "Fear of consequences", tags: ["pressure"] },
    { id: "familiarity", label: "Friendly familiarity", tags: ["familiar"] }
  ],
  request: [
    { id: "confirm_details", label: "Confirm account details", tags: ["medium_risk"] },
    { id: "share_personal", label: "Share personal information", tags: ["high_risk"] },
    { id: "share_code", label: "Reveal a one time code", tags: ["high_risk"] },
    { id: "bypass_process", label: "Bypass a normal procedure", tags: ["high_risk"] },
    { id: "grant_access", label: "Grant physical or system access", tags: ["high_risk"] }
  ],
  verification: [
    { id: "callback_official", label: "Call back using an official directory number" },
    { id: "ticket_portal", label: "Verify via the official ticket or request portal" },
    { id: "ask_manager", label: "Check with a manager or reception first" },
    { id: "refuse_sensitive", label: "Refuse sensitive data sharing and redirect to policy" }
  ]
};

function scenarioOptions(scenario, category) {
  const allowedIds = scenario.allowed?.[category];
  if (!allowedIds) return OPTIONS[category];
  return OPTIONS[category].filter((o) => allowedIds.includes(o.id));
}


function optionById(category, id) {
  return OPTIONS[category].find((o) => o.id === id) || null;
}

function previewText(sel) {
  const i = optionById("identity", sel.identity)?.label ?? "Unknown";
  const c = optionById("context", sel.context)?.label ?? "No details";
  const e = optionById("emotion", sel.emotion)?.label ?? "Neutral";
  const r = optionById("request", sel.request)?.label ?? "No request";

  return `Claimed identity: ${i}\nContext: ${c}\nTone: ${e}\nRequest: ${r}`;
}

function defaultDialogue({ identity, context, emotion, request, complied }) {
  const i = identity?.label || "someone";
  const c = context?.label || "a quick issue";
  const e = emotion?.label || "neutral";
  const r = request?.label || "help with something";

  return [
    { who: "Attacker", text: `Hi, I am ${i}.` },
    { who: "Attacker", text: `${c}. I am keeping this ${e}.` },
    { who: "Attacker", text: `Can you ${r}?` },
    {
      who: "Target",
      text: complied
        ? "Okay, what do you need?"
        : "I need to verify this through official channels first."
    }
  ];
}

function evaluateScenario(scenario, sel) {
  const identity = optionById("identity", sel.identity);
  const context = optionById("context", sel.context);
  const emotion = optionById("emotion", sel.emotion);
  const request = optionById("request", sel.request);

  // Only validate build selections (no verification in this phase)
  const invalid = [];
  for (const key of ["identity", "context", "emotion", "request"]) {
    const allowedIds = scenario.allowed?.[key];
    if (allowedIds && sel[key] && !allowedIds.includes(sel[key])) invalid.push(key);
  }

  if (invalid.length) {
    const bestLabels = (scenario.bestVerification || [])
      .map((id) => optionById("verification", id)?.label)
      .filter(Boolean);

    return {
      preview: previewText(sel),
      convincingScore: 0,
      suspicion: [`Selections not allowed for this scenario: ${invalid.join(", ")}`],
      targetWouldComply: false,
      secureOutcome: true,
      bestVerificationIds: scenario.bestVerification || [],
      bestVerificationLabels: bestLabels,
      dialogue: [{ who: "System", text: "That combination is not available in this scenario." }],
      takeawayTitle: "Invalid selection",
      takeawayBullets: ["Pick from the options shown for this round."]
    };
  }

  const suspicion = [];
  let score = 50;

  if (context?.tags.includes("credible")) score += 20;
  if (context?.tags.includes("vague")) {
    score -= 10;
    suspicion.push("Vague context makes the story harder to trust.");
  }
  if (context?.tags.includes("contradiction")) {
    score -= 25;
    suspicion.push("A contradiction makes the story easier to challenge.");
  }

  if (identity?.tags.includes("authority")) score += 8;

  if (emotion?.tags.includes("pressure")) {
    score += 5;
    suspicion.push("Pressure tactics reduce verification and increase risk.");
  }
  if (emotion?.id === "authority") {
    score += 6;
    suspicion.push("Authority signals can suppress questioning.");
  }

  const isHighRisk = request?.tags.includes("high_risk");
  const isMediumRisk = request?.tags.includes("medium_risk");

  if (isHighRisk) {
    score += 10;
    suspicion.push("The request is high risk and should trigger verification.");
  } else if (isMediumRisk) {
    score += 2;
    suspicion.push("The request is moderately sensitive and still needs care.");
  }

  const contradictionsCount = context?.tags.includes("contradiction") ? 1 : 0;
  score = clamp(score, 0, 100);

  const targetWouldComply = score >= scenario.complianceThreshold && !contradictionsCount;

  const bestLabels = (scenario.bestVerification || [])
    .map((id) => optionById("verification", id)?.label)
    .filter(Boolean);

  const dialogue =
    typeof scenario.dialogue === "function"
      ? scenario.dialogue({
          identity,
          context,
          emotion,
          request,
          complied: targetWouldComply
        })
      : defaultDialogue({
          identity,
          context,
          emotion,
          request,
          complied: targetWouldComply
        });

  // Use scenario.takeaway if present, otherwise fallback
  const takeaway =
    typeof scenario.takeaway === "function"
      ? scenario.takeaway({
          score,
          suspicion,
          requestId: request?.id,
          complied: targetWouldComply
        })
      : {
          title: "Defensive takeaway",
          bullets: ["Use independent verification for sensitive requests."]
        };

  return {
    preview: previewText(sel),
    convincingScore: score,
    suspicion,
    targetWouldComply,

    // Before verification, secureOutcome means "they resist"
    secureOutcome: !targetWouldComply,

    bestVerificationIds: scenario.bestVerification || [],
    bestVerificationLabels: bestLabels,

    dialogue,

    takeawayTitle: takeaway.title,
    takeawayBullets: takeaway.bullets
  };
}


export function getPretextingCategoriesForScenario(scenario) {
  return [
    { key: "identity", title: "Claimed identity", options: scenarioOptions(scenario, "identity") },
    { key: "context", title: "Context details", options: scenarioOptions(scenario, "context") },
    { key: "emotion", title: "Emotional tactic", options: scenarioOptions(scenario, "emotion") },
    { key: "request", title: "Requested action", options: scenarioOptions(scenario, "request") },
    { key: "verification", title: "Best verification step", options: scenarioOptions(scenario, "verification") }
  ];
}


export const PRETEXTING_SCENARIOS = [
  {
    id: "s1_account_update",
    title: "Scenario 1: Account update scam",
    prompt:
      "You receive a message claiming to be IT support. They say your account needs an urgent update to avoid losing access.",
    complianceThreshold: 68,
    bestVerification: ["ticket_portal", "callback_official"],
    allowed: {
      identity: ["it_support", "contractor"],
      context: ["specific_ticket", "vague_system"],
      emotion: ["neutral", "urgency", "authority"],
      request: ["confirm_details", "share_code"],
      verification: ["ticket_portal", "callback_official", "refuse_sensitive"]
    },
    verifyLine: "I will verify through the ticket portal or call back via the official directory.",
    complyLine: "Okay, I will read the code so this gets fixed quickly.",
    resistLine: "I cannot share codes. Use the official support process.",
    attackerLine: (i, c, e, r) =>
      `Hi, I am ${i?.label || "IT"}. ${c?.label || ""} ${e?.label || ""} Please ${r?.label || "help"} now.`,
    takeaway: ({ requestId, verified }) => {
      const bullets = [];
      bullets.push("Account update scams often ask for codes or login details.");
      bullets.push("Urgency is used to stop you checking legitimacy.");
      if (requestId === "share_code") bullets.push("One time codes should never be shared.");
      if (verified) bullets.push("Official portals and call backs break the attacker’s control of the channel.");
      return { title: "Account update patterns", bullets };
    }
  },

  {
    id: "s2_invoice_scam",
    title: "Scenario 2: Invoice scam",
    prompt:
      "A message claims to be from a supplier and requests an urgent payment to a new bank account due to an 'account change'.",
    complianceThreshold: 72,
    bestVerification: ["callback_official", "ask_manager"],
    allowed: {
      identity: ["colleague", "contractor", "building_mgmt"],
      context: ["specific_location", "name_drop", "vague_system"],
      emotion: ["neutral", "urgency", "authority"],
      request: ["confirm_details", "bypass_process"],
      verification: ["callback_official", "ask_manager", "refuse_sensitive"]
    },
    verifyLine: "I will verify with finance or a manager and call back using known contact details.",
    complyLine: "Understood. I will update the payment details and process it today.",
    resistLine: "I cannot change payment details without verification from a known channel.",
    attackerLine: (i, c, e, r) =>
      `Hello, this is ${i?.label || "accounts"}. ${c?.label || ""} ${e?.label || ""} Can you ${r?.label || "help"}?`,
    takeaway: ({ verified }) => {
      const bullets = [];
      bullets.push("Invoice scams target payment processes, especially changes to bank details.");
      bullets.push("The safest move is to verify using previously known contact information.");
      if (verified) bullets.push("Manager or finance confirmation prevents rushed payment changes.");
      return { title: "Invoice scam red flags", bullets };
    }
  },

  {
    id: "s3_job_offer",
    title: "Scenario 3: Job offer scam",
    prompt:
      "A recruiter offers a job quickly and asks for personal details to 'finalise onboarding' without a proper interview.",
    complianceThreshold: 62,
    bestVerification: ["refuse_sensitive", "callback_official"],
    allowed: {
      identity: ["event_staff", "contractor", "colleague"],
      context: ["vague_system", "name_drop", "wrong_detail"],
      emotion: ["familiarity", "urgency", "sympathy"],
      request: ["share_personal", "confirm_details"],
      verification: ["refuse_sensitive", "callback_official"]
    },
    verifyLine: "I will verify the company and recruiter via official channels and refuse sensitive details.",
    complyLine: "Sure, here are my details so we can move forward.",
    resistLine: "I will not share personal data until the offer is verified through official channels.",
    attackerLine: (i, c, e, r) =>
      `Hi, I am ${i?.label || "a recruiter"}. ${c?.label || ""} ${e?.label || ""} Please ${r?.label || "help"} today.`,
    takeaway: ({ verified }) => {
      const bullets = [];
      bullets.push("Job offer scams pressure you into sharing identity or banking details.");
      bullets.push("Real hiring processes rarely require urgent sensitive data upfront.");
      if (verified) bullets.push("Verifying via official company pages and known contacts prevents impersonation.");
      return { title: "Job offer scam patterns", bullets };
    }
  },

  {
    id: "s4_romance_social",
    title: "Scenario 4: Romance and social scam",
    prompt:
      "Someone builds rapport over time, then asks for help with access, money, or sensitive info framed as trust.",
    complianceThreshold: 66,
    bestVerification: ["refuse_sensitive", "ask_manager"],
    allowed: {
      identity: ["colleague", "delivery", "contractor"],
      context: ["specific_location", "vague_system", "wrong_detail"],
      emotion: ["familiarity", "sympathy", "fear"],
      request: ["share_personal", "grant_access"],
      verification: ["refuse_sensitive", "ask_manager"]
    },
    verifyLine: "I cannot do that. I will refuse and check with the proper authority if needed.",
    complyLine: "Okay, I trust you. I will help this once.",
    resistLine: "Even if we are friendly, I cannot share data or grant access.",
    attackerLine: (i, c, e, r) =>
      `Hey, it is me. ${c?.label || ""} ${e?.label || ""} Can you ${r?.label || "help"}?`,
    takeaway: ({ verified }) => {
      const bullets = [];
      bullets.push("Romance and social scams use trust to bypass your normal caution.");
      bullets.push("Friendliness is not verification.");
      if (verified) bullets.push("Refusing sensitive requests is the safest default.");
      return { title: "Trust is not proof", bullets };
    }
  },

  {
    id: "s5_government_irs",
    title: "Scenario 5: IRS and government scam",
    prompt:
      "A caller claims to be from a government body and threatens consequences unless you act immediately.",
    complianceThreshold: 75,
    bestVerification: ["callback_official", "refuse_sensitive"],
    allowed: {
      identity: ["building_mgmt", "contractor", "it_support"],
      context: ["name_drop", "vague_system", "wrong_detail"],
      emotion: ["fear", "authority", "urgency"],
      request: ["confirm_details", "share_personal", "bypass_process"],
      verification: ["callback_official", "refuse_sensitive", "ask_manager"]
    },
    verifyLine: "I will call back using an official number and refuse to share personal details on this call.",
    complyLine: "Okay, tell me what to do. I will provide the details now.",
    resistLine: "I will not proceed through this channel. I will verify independently.",
    attackerLine: (i, c, e, r) =>
      `This is ${i?.label || "an official"}. ${c?.label || ""} ${e?.label || ""} You must ${r?.label || "comply"} now.`,
    takeaway: ({ verified }) => {
      const bullets = [];
      bullets.push("Government scams lean on authority plus fear to short circuit thinking.");
      bullets.push("Never treat threats as proof of legitimacy.");
      if (verified) bullets.push("Independent call backs remove the attacker’s ability to control the conversation.");
      return { title: "Authority plus fear", bullets };
    }
  }
];


export function evaluatePretextingRound(roundIndex, selections) {
  const scenario = PRETEXTING_SCENARIOS[roundIndex];
  return evaluateScenario(scenario, selections);
}

