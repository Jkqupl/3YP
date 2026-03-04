/*
  Survey schemas for pre and post module surveys.
  Each question has:
    id       — unique key stored in the JSON
    type     — "scale" (1-5 Likert) | "radio" (labelled options) | "text" (free text)
    text     — the question shown to the user
    required — whether the user must answer before proceeding
    options  — for "radio" type only
    low/high — label for scale endpoints (scale type only)

  Design rationale (third year project):
    - confidence_pre / confidence_post (same wording) → direct pre/post comparison,
      shows measurable confidence shift per module
    - awareness questions → tests whether the simulation changed conceptual understanding,
      not just self-reported confidence
    - realism questions → lets you argue the simulation was ecologically valid
    - behaviour_intent → stronger than "did it change you?" — asks what they would
      actually do, which maps to real-world transfer of learning
    - module-specific situational questions → tailored to the exact threat modelled,
      avoids generic survey noise
*/

// ── Shared pre-survey (asked before every module) ──────────────────────────

const SHARED_PRE = [
  {
    id: "confidence_pre",
    type: "scale",
    text: "How confident are you in your ability to recognise and respond to this type of attack?",
    required: true,
    low: "Not at all confident",
    high: "Very confident",
  },
  {
    id: "familiarity",
    type: "scale",
    text: "Before this module, how much did you know about this type of social engineering attack?",
    required: true,
    low: "Nothing at all",
    high: "A great deal",
  },
  {
    id: "prior_encounter",
    type: "radio",
    text: "Have you personally encountered this type of attack before?",
    required: true,
    options: [
      { value: "yes_recognised", label: "Yes, and I recognised it at the time" },
      { value: "yes_fell_for",   label: "Yes, and I only realised afterwards" },
      { value: "no",             label: "No" },
      { value: "unsure",         label: "I'm not sure" },
    ],
  },
];

// ── Shared post-survey (asked after every module) ──────────────────────────

const SHARED_POST = [
  {
    id: "confidence_post",
    // Intentionally mirrors confidence_pre — enables direct pre/post comparison
    type: "scale",
    text: "How confident are you now in your ability to recognise and respond to this type of attack?",
    required: true,
    low: "Not at all confident",
    high: "Very confident",
  },
  {
    id: "difficulty",
    type: "scale",
    text: "How difficult did you find the simulation overall?",
    required: true,
    low: "Very easy",
    high: "Very difficult",
  },
  {
    id: "realism",
    type: "scale",
    text: "How realistic did the scenarios feel compared to a real-life situation?",
    required: true,
    low: "Not realistic at all",
    high: "Very realistic",
  },
  {
    id: "engagement",
    type: "scale",
    text: "How engaging did you find the simulation as a learning tool?",
    required: true,
    low: "Not engaging at all",
    high: "Very engaging",
  },
  {
    id: "behaviour_intent",
    type: "radio",
    text: "After completing this module, how likely are you to change how you respond to this type of attack in real life?",
    required: true,
    options: [
      { value: "very_likely",    label: "Very likely — I know what to do differently now" },
      { value: "somewhat",       label: "Somewhat — I'm more aware, but not sure I'd act differently" },
      { value: "unlikely",       label: "Unlikely — I already behaved this way" },
      { value: "no_change",      label: "No change — I didn't find it useful" },
    ],
  },
  {
    id: "freetext",
    type: "text",
    text: "Is there anything the simulation did particularly well, or anything that could be improved? (optional)",
    required: false,
  },
];


// ── PHISHING ───────────────────────────────────────────────────────────────

export const SURVEY_SCHEMAS = {
  phishing: {
    pre: [
      ...SHARED_PRE,
      {
        id: "phish_spot_cues",
        type: "radio",
        text: "Which of the following do you think is the most reliable sign that an email might be phishing?",
        required: true,
        options: [
          { value: "sender_name",   label: "The sender's display name looks wrong" },
          { value: "sender_domain", label: "The sender's email domain doesn't match the organisation" },
          { value: "bad_grammar",   label: "Poor spelling or grammar in the email" },
          { value: "urgent_tone",   label: "The email creates urgency or threatens consequences" },
        ],
      },
      {
        id: "phish_link_habit",
        type: "radio",
        text: "When you receive an unexpected email with a link, what do you usually do?",
        required: true,
        options: [
          { value: "click_directly",  label: "Click the link directly" },
          { value: "hover_first",     label: "Hover over the link to check the URL first" },
          { value: "go_direct",       label: "Navigate to the site directly rather than clicking" },
          { value: "ignore_delete",   label: "Ignore or delete it without clicking" },
        ],
      },
    ],

    post: [
      ...SHARED_POST,
      {
        id: "phish_key_learning",
        type: "radio",
        text: "After completing this module, which technique do you feel most confident identifying?",
        required: true,
        options: [
          { value: "spoofed_domain",  label: "Spoofed sender domains" },
          { value: "fake_login",      label: "Fake login pages" },
          { value: "urgency_tactics", label: "Urgency and fear tactics" },
          { value: "link_mismatch",   label: "Links that don't match the displayed text" },
        ],
      },
      {
        id: "phish_sim_format",
        type: "radio",
        text: "How useful was the email inbox simulation format for learning to spot phishing?",
        required: true,
        options: [
          { value: "very_useful",    label: "Very useful — seeing real email layouts helped" },
          { value: "somewhat",       label: "Somewhat useful" },
          { value: "neutral",        label: "Neutral — the format didn't affect my learning" },
          { value: "not_useful",     label: "Not useful — I'd prefer a different format" },
        ],
      },
    ],
  },


  // ── TAILGATING ────────────────────────────────────────────────────────────

  tailgating: {
    pre: [
      ...SHARED_PRE,
      {
        id: "tailgate_door_habit",
        type: "radio",
        text: "If someone without an access card asked you to hold a secure door open for them, what would you normally do?",
        required: true,
        options: [
          { value: "hold_no_question", label: "Hold it — it would feel rude not to" },
          { value: "hold_if_looks_ok", label: "Hold it if they looked like they belonged" },
          { value: "ask_verify",       label: "Ask them to verify who they are first" },
          { value: "redirect_security",label: "Redirect them to reception or the intercom" },
        ],
      },
      {
        id: "tailgate_pressure_awareness",
        type: "scale",
        text: "How aware are you that social pressure (politeness, urgency, authority) can be used to bypass physical security?",
        required: true,
        low: "Not aware at all",
        high: "Very aware",
      },
    ],

    post: [
      ...SHARED_POST,
      {
        id: "tailgate_pressure_handling",
        type: "radio",
        text: "After completing this module, how would you handle someone using social pressure to get you to hold a secure door?",
        required: true,
        options: [
          { value: "redirect_confidently", label: "Redirect them to security or the intercom without hesitation" },
          { value: "ask_question",         label: "Ask a verification question before deciding" },
          { value: "probably_hold",        label: "Still probably hold it — it's hard to refuse in person" },
          { value: "unsure",               label: "I'm still not sure what I'd do" },
        ],
      },
      {
        id: "tailgate_game_format",
        type: "radio",
        text: "How useful was the game-based simulation format (with characters and scenarios) for learning about tailgating?",
        required: true,
        options: [
          { value: "very_useful",  label: "Very useful — the scenarios felt real" },
          { value: "somewhat",     label: "Somewhat useful" },
          { value: "neutral",      label: "Neutral — the format didn't affect my learning" },
          { value: "not_useful",   label: "Not useful — I'd prefer a different format" },
        ],
      },
    ],
  },


  // ── PRETEXTING ────────────────────────────────────────────────────────────

  pretexting: {
    pre: [
      ...SHARED_PRE,
      {
        id: "pretext_authority_response",
        type: "radio",
        text: "If someone called claiming to be from IT support and said they needed your password urgently to fix an issue, what would you do?",
        required: true,
        options: [
          { value: "give_it",        label: "Give it — IT can be trusted with that" },
          { value: "hesitate_give",  label: "Hesitate, but probably give it to avoid causing problems" },
          { value: "verify_first",   label: "Verify their identity through official channels before doing anything" },
          { value: "refuse_report",  label: "Refuse and report the call" },
        ],
      },
      {
        id: "pretext_trust_cues",
        type: "radio",
        text: "Which of the following would make you most likely to trust an unexpected caller asking for sensitive information?",
        required: true,
        options: [
          { value: "knows_details",    label: "They already know some details about me or my organisation" },
          { value: "sounds_urgent",    label: "They say it's urgent and there'll be consequences if I don't help" },
          { value: "claims_authority", label: "They claim a senior job title or authority" },
          { value: "none",             label: "None of these — I wouldn't trust an unexpected caller" },
        ],
      },
    ],

    post: [
      ...SHARED_POST,
      {
        id: "pretext_attacker_perspective",
        type: "radio",
        text: "Building a pretext as the 'attacker' in the simulation — how did that affect your understanding of the attack?",
        required: true,
        options: [
          { value: "much_clearer",   label: "Made it much clearer how attackers think" },
          { value: "somewhat",       label: "Gave me some new insight" },
          { value: "no_difference",  label: "Didn't change my understanding" },
          { value: "confusing",      label: "Found it confusing or uncomfortable" },
        ],
      },
      {
        id: "pretext_verify_intent",
        type: "radio",
        text: "After this module, how would you respond if someone called claiming to be IT support and asked for your login credentials?",
        required: true,
        options: [
          { value: "refuse_report",   label: "Refuse immediately and report it" },
          { value: "verify_callback", label: "Hang up and call back on an official number to verify" },
          { value: "ask_questions",   label: "Ask them security questions before deciding" },
          { value: "unsure",          label: "I'm still not confident what I'd do" },
        ],
      },
    ],
  },
};