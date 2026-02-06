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
    { id: "specific_ticket", label: "Provide a department name and service", tags: ["credible"] },
    { id: "specific_location", label: "Mention a real location and a routine process", tags: ["credible"] },
    { id: "vague_system", label: "Mention a system vaguely with no specifics", tags: ["vague"] },
    { id: "name_drop", label: "Name drop a manager", tags: ["authority_boost"] },
    { id: "wrong_detail", label: "Include a random detail", tags: ["contradiction"] }
  ],
  emotion: [
    { id: "neutral", label: "Neutral and calm", tags: ["neutral"] },
    { id: "urgency", label: "Urgenct and with time pressure", tags: ["pressure"] },
    { id: "authority", label: "With authority and confidence", tags: ["pressure", "authority"] },
    { id: "sympathy", label: "Sympathy and personal appeal", tags: ["pressure"] },
    { id: "fear", label: "Play on the fear of consequences", tags: ["pressure"] },
    { id: "familiarity", label: "Friendly", tags: ["familiar"] }
  ],
  request: [
    { id: "confirm_details", label: "Confirm account details", tags: ["medium_risk"] },
    { id: "share_personal", label: "Share personal information", tags: ["high_risk"] },
    { id: "share_code", label: "Reveal a one time code", tags: ["high_risk"] },
    { id: "bypass_process", label: "Bypass a normal procedure", tags: ["high_risk"] },
    { id: "grant_access", label: "Grant physical or system access", tags: ["high_risk"] }
  ],
  verification: [
    { id: "callback_official", label: "Call back using an official number" },
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
  const iId = identity?.id;
  const cId = context?.id;
  const eId = emotion?.id;
  const rId = request?.id;

  const who = "Attacker (You)";

  const identityOpen = {
    it_support: "Hi, IT here.",
    building_mgmt: "Hi, building management here.",
    delivery: "Hi, delivery downstairs.",
    event_staff: "Hi, events team here.",
    colleague: "Hey, it’s me from work.",
    contractor: "Hi, I’m a contractor on site."
  };

  const contextBit = {
    specific_ticket: "It’s about a request for your department.",
    specific_location: "I’m at the entrance doing the usual sign in stuff.",
    vague_system: "There’s something odd showing on the system.",
    name_drop: "Your manager asked me to get this sorted today.",
    wrong_detail: "Quick one, I might have the department name slightly wrong."
  };

  // Keep emotion subtle so it does not sound like a roleplay prompt
  const toneTag = {
    neutral: "",
    urgency: "I’m a bit tight on time.",
    authority: "I need this done now.",
    sympathy: "Sorry, I know it’s annoying.",
    fear: "If we leave it, it could cause problems.",
    familiarity: "Cheers, appreciate it."
  };

  const ask = (() => {
    switch (rId) {
      case "confirm_details":
        return "Can you just confirm a couple of details for me?";
      case "share_personal":
        return "Can you send over your details so I can finish this?";
      case "bypass_process":
        return "Can we skip the usual steps this once and just get it done?";
      case "grant_access":
        return "Can you grant me access so I can sort this?";
      case "share_code":
        // If this still exists anywhere, keep it supported
        return "Can you read out the one time code you’ve just received?";
      default:
        return "Can you help me with something quickly?";
    }
  })();

  const resist = (() => {
    // React to weak context without sounding robotic
    const needsRef =
      cId === "vague_system" ? "Which system is it, and what’s the reference?" :
      cId === "wrong_detail" ? "Which department is this meant to be for?" :
      "What’s the ticket or reference number?";

    switch (rId) {
      case "grant_access":
        return `I can’t grant access like that. ${needsRef} I’ll verify it first.`;
      case "bypass_process":
        return "I can’t bypass the process. Put it through properly and I’ll take a look.";
      case "share_personal":
        return "I’m not sharing personal details on this. I’ll verify first.";
      case "confirm_details":
        return `Before I confirm anything, ${needsRef} I’ll check it on the proper channel.`;
      case "share_code":
        return "I can’t share codes. If it’s real, it needs to go through the official process.";
      default:
        return "I’ll need to verify this first.";
    }
  })();

  const comply = (() => {
    switch (rId) {
      case "grant_access":
        return "Alright. What access do you need exactly?";
      case "bypass_process":
        return "Okay, just tell me what you want me to do.";
      case "share_personal":
        return "Okay, what details do you need?";
      case "confirm_details":
        return "Yeah, sure. What do you need to confirm?";
      case "share_code":
        return "Okay, I’ve got it here.";
      default:
        return "Okay, go on.";
    }
  })();

  const line1Parts = [
    identityOpen[iId] || "Hi.",
    contextBit[cId] || "Quick one.",
    toneTag[eId] || ""
  ].filter(Boolean);

  const line1 = line1Parts.join(" ");
  const line2 = ask;
  const line3 = complied ? comply : resist;

  return [
    { who, text: line1 },
    { who, text: line2 },
    { who: "Target", text: line3 }
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
      "How would you try get access to someones account details.",
    complianceThreshold: 68,
    bestVerification: ["ticket_portal", "callback_official"],
    allowed: {
      identity: ["it_support", "contractor"],
      context: ["specific_ticket", "vague_system"],
      emotion: ["neutral", "urgency", "authority"],
      request: ["confirm_details", "grant_access"],
      verification: ["ticket_portal", "callback_official", "refuse_sensitive"]
    },
    verifyLine: "I will verify through the ticket portal or call back via the official number.",
    complyLine: "Okay, I will grant access so this gets fixed quickly.",
    resistLine: "I cannot grant access without going through the proper process.",
    attackerLine: (i, c, e, r) =>
      `Hi, I am ${i?.label || "IT"}. ${c?.label || ""} ${e?.label || ""} Please ${r?.label || "help"} now.`,
    takeaway: ({ requestId, verified }) => {
      const bullets = [];
      bullets.push("Account update scams often ask for codes or login details.");
      bullets.push("Urgency is used to stop you checking legitimacy.");
      if (requestId === "grant_access")
        bullets.push("Access should only be granted through verified and logged processes.");
      if (verified) bullets.push("Official portals and call backs break the attacker’s control of the channel.");
      return { title: "Account update patterns", bullets };
    }
  },

  {
    id: "s2_invoice_scam",
    title: "Scenario 2: Invoice scam",
    prompt:
      "How would you try to convince someone to send you money for a 'order'.",
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
      "How would you get someones personal details pretending to be a recruiter.",
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
      "You've been speaking to this person for a while already. How would you seal the deal and get sensitive information or given private access.",
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
      "You're pretending to be in a position of power to get sensitive information.",
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

