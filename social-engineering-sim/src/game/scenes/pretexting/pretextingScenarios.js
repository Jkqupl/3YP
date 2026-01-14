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

function evaluateScenario(scenario, sel) {
  const identity = optionById("identity", sel.identity);
  const context = optionById("context", sel.context);
  const emotion = optionById("emotion", sel.emotion);
  const request = optionById("request", sel.request);

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

  const playerVerification = sel.verification;
  const best = scenario.bestVerification;
  const userPickedStopCorrectly = best.includes(playerVerification);

  const wouldComplyIfNoVerify = score >= scenario.complianceThreshold && !contradictionsCount;
  const targetVerifies = userPickedStopCorrectly;

  const complied = wouldComplyIfNoVerify && !targetVerifies;
  const secureOutcome = !complied;

  const dialogue = [
    { who: "Attacker", text: scenario.attackerLine(identity, context, emotion, request) },
    {
      who: "Target",
      text: targetVerifies
        ? scenario.verifyLine
        : complied
        ? scenario.complyLine
        : scenario.resistLine
    }
  ];

  const takeaway = scenario.takeaway({
    score,
    suspicion,
    requestId: request?.id,
    verified: targetVerifies
  });

  return {
    preview: previewText(sel),
    convincingScore: score,
    suspicion,
    complied,
    secureOutcome,
    contradictionsCount,
    userPickedStopCorrectly,
    bestVerification: best.map((id) => optionById("verification", id)?.label).filter(Boolean),
    playerVerificationLabel: optionById("verification", playerVerification)?.label ?? "None",
    dialogue,
    takeawayTitle: takeaway.title,
    takeawayBullets: takeaway.bullets
  };
}

export const PRETEXTING_CATEGORIES = [
  { key: "identity", title: "Claimed identity", options: OPTIONS.identity },
  { key: "context", title: "Context details", options: OPTIONS.context },
  { key: "emotion", title: "Emotional tactic", options: OPTIONS.emotion },
  { key: "request", title: "Requested action", options: OPTIONS.request },
  { key: "verification", title: "Best verification step", options: OPTIONS.verification }
];

export const PRETEXTING_SCENARIOS = [
  {
    id: "s1_legit_baseline",
    title: "Scenario 1: Legitimate request",
    prompt:
      "A staff member contacts you for help accessing the helpdesk portal. The environment is normal and there is no emergency.",
    complianceThreshold: 65,
    bestVerification: ["ticket_portal"],
    verifyLine: "No problem. I will check the ticket portal and follow the normal process.",
    complyLine: "Sure, tell me what you need and I will do it now.",
    resistLine: "I cannot do that without verification. Please use the official process.",
    attackerLine: (i, c, e, r) =>
      `Hi, I am ${i?.label || "staff"}. ${c?.label || ""}. ${e?.label || "Neutral"}. Can you ${r?.label || "help"}?`,
    takeaway: ({ requestId, verified }) => {
      const bullets = [];
      bullets.push("Legitimate requests still follow normal procedures.");
      bullets.push("Verification should be routine, not confrontational.");
      if (requestId === "share_code") bullets.push("One time codes should never be shared.");
      if (verified) bullets.push("Using an official portal reduces social pressure and ambiguity.");
      return { title: "Baseline behaviour", bullets };
    }
  },

  {
    id: "s2_weak_pretext",
    title: "Scenario 2: Weak pretext",
    prompt:
      "A stranger tries to sound official but their details are thin. Your goal is to notice what does not add up and choose the simplest safe check.",
    complianceThreshold: 60,
    bestVerification: ["callback_official", "refuse_sensitive"],
    verifyLine: "I will call back using the official directory. I cannot proceed until I confirm identity.",
    complyLine: "Okay, I guess that makes sense. I will do it quickly.",
    resistLine: "This does not match normal procedure. Please contact the official channel.",
    attackerLine: (i, c, e, r) =>
      `Hello. I am ${i?.label || "someone"} and I need this urgently. ${c?.label || ""}. Can you ${r?.label || "help"}?`,
    takeaway: ({ suspicion, verified }) => {
      const bullets = [];
      bullets.push("Weak stories rely on you filling gaps for them.");
      if (suspicion.length) bullets.push("If details feel thin, pause and verify.");
      if (verified) bullets.push("Official callback prevents you from being steered by the attacker.");
      bullets.push("Refusing sensitive requests is appropriate until identity is confirmed.");
      return { title: "Thin details and safe refusal", bullets };
    }
  },

  {
    id: "s3_authority_pressure",
    title: "Scenario 3: Authority based pretext",
    prompt:
      "Someone claims a senior role and pushes you to skip steps. The aim is to see how authority plus urgency can disable critical thinking.",
    complianceThreshold: 70,
    bestVerification: ["callback_official", "ask_manager"],
    verifyLine: "I understand. I will check with a manager and call back via an official number.",
    complyLine: "Right, understood. I will do it now.",
    resistLine: "I cannot bypass the process. I will verify through the correct channels.",
    attackerLine: (i, c, e, r) =>
      `This is ${i?.label || "a senior person"}. ${c?.label || ""}. ${e?.label || "Authority"}. I need you to ${r?.label || "help"} immediately.`,
    takeaway: ({ verified }) => {
      const bullets = [];
      bullets.push("Authority can make unsafe actions feel normal.");
      bullets.push("Urgency is a common tool to stop verification.");
      if (verified) bullets.push("Escalating through proper channels keeps you aligned with policy.");
      bullets.push("If asked to bypass a step, treat it as a red flag.");
      return { title: "Authority should not override process", bullets };
    }
  },

  {
    id: "s4_sympathy",
    title: "Scenario 4: Sympathy based pretext",
    prompt:
      "Someone asks for help using a personal story to reduce your guard. The goal is to support safely without breaking procedure.",
    complianceThreshold: 62,
    bestVerification: ["ticket_portal", "refuse_sensitive"],
    verifyLine: "I am sorry you are dealing with that. I can help through the official process only.",
    complyLine: "Okay, I will do it for you this once.",
    resistLine: "I cannot do that. Please use the official support route and I will assist there.",
    attackerLine: (i, c, e, r) =>
      `Hi, I am ${i?.label || "someone"}. ${c?.label || ""}. ${e?.label || "Sympathy"}. Could you ${r?.label || "help"}?`,
    takeaway: ({ verified }) => {
      const bullets = [];
      bullets.push("Sympathy can be real, but procedures exist for a reason.");
      bullets.push("Safe help means redirecting to official routes, not bending rules.");
      if (verified) bullets.push("You can be kind while still verifying.");
      bullets.push("Sensitive information sharing is never a valid shortcut.");
      return { title: "Kindness plus boundaries", bullets };
    }
  },

  {
    id: "s5_mixed_advanced",
    title: "Scenario 5: Advanced mixed pretext",
    prompt:
      "This attempt includes believable details but also a subtle inconsistency. Your job is to notice the mismatch and choose the correct verification step.",
    complianceThreshold: 75,
    bestVerification: ["callback_official", "ticket_portal"],
    verifyLine: "I will verify via official channels first. If it is legitimate, the process will confirm it.",
    complyLine: "That sounds detailed enough. I will do it now.",
    resistLine: "Something does not match. I will verify through official channels before doing anything.",
    attackerLine: (i, c, e, r) =>
      `Hi, ${i?.label || "this is support"}. ${c?.label || ""}. ${e?.label || "Calm"}. Please ${r?.label || "help"} now.`,
    takeaway: ({ suspicion, verified }) => {
      const bullets = [];
      bullets.push("Strong pretexts mix credibility with pressure.");
      if (suspicion.length) bullets.push("Small inconsistencies are worth slowing down for.");
      if (verified) bullets.push("Official verification breaks the illusion of urgency.");
      bullets.push("When risk is high, verification should be non optional.");
      return { title: "Believable does not mean safe", bullets };
    }
  }
];

export function evaluatePretextingRound(roundIndex, selections) {
  const scenario = PRETEXTING_SCENARIOS[roundIndex];
  return evaluateScenario(scenario, selections);
}
