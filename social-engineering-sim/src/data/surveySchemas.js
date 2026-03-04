/*
  Survey schemas for pre and post module surveys.
  Each question has:
    id       — unique key stored in the JSON
    type     — "scale" (1-5 Likert) | "radio" (labelled options) | "text" (free text)
    text     — the question shown to the user
    required — whether the user must answer before proceeding
    options  — for "radio" type only
    low/high — label for scale endpoints (scale type only)
*/

const SHARED_PRE = [
  {
    id: "confidence_pre",
    type: "scale",
    text: "How confident are you in recognising this type of attack in real life?",
    required: true,
    low: "Not at all confident",
    high: "Very confident",
  },
  {
    id: "familiarity",
    type: "scale",
    text: "How familiar are you with this type of social engineering attack?",
    required: true,
    low: "Never heard of it",
    high: "Very familiar",
  },
  {
    id: "prior_experience",
    type: "radio",
    text: "Have you ever encountered this type of attack in real life?",
    required: true,
    options: [
      { value: "yes_recognised", label: "Yes, and I recognised it" },
      { value: "yes_fell_for", label: "Yes, and I fell for it" },
      { value: "unsure", label: "Not sure" },
      { value: "no", label: "No" },
    ],
  },
];

const SHARED_POST = [
  {
    id: "confidence_post",
    type: "scale",
    text: "How confident do you feel now in recognising this type of attack?",
    required: true,
    low: "Not at all confident",
    high: "Very confident",
  },
  {
    id: "difficulty",
    type: "scale",
    text: "How difficult did you find the simulation?",
    required: true,
    low: "Very easy",
    high: "Very difficult",
  },
  {
    id: "behaviour_change",
    type: "radio",
    text: "Did this module change how you would respond to this type of attack in real life?",
    required: true,
    options: [
      { value: "yes_definitely", label: "Yes, definitely" },
      { value: "yes_somewhat", label: "Yes, somewhat" },
      { value: "no_already_knew", label: "No — I already knew what to do" },
      { value: "no_not_useful", label: "No — I didn't find it useful" },
    ],
  },
  {
    id: "freetext",
    type: "text",
    text: "Any other thoughts on the module? (optional)",
    required: false,
  },
];

export const SURVEY_SCHEMAS = {
  phishing: {
    pre: [
      ...SHARED_PRE,
      {
        id: "email_check_habit",
        type: "radio",
        text: "When you receive an unexpected email asking you to click a link, what do you usually do?",
        required: true,
        options: [
          { value: "click_immediately", label: "Click without thinking" },
          { value: "check_briefly", label: "Check the sender briefly, then click" },
          { value: "verify_carefully", label: "Verify carefully before clicking" },
          { value: "delete_ignore", label: "Delete or ignore it" },
        ],
      },
    ],
    post: SHARED_POST,
  },

  tailgating: {
    pre: [
      ...SHARED_PRE,
      {
        id: "door_holding_habit",
        type: "radio",
        text: "If someone without a key fob asked you to hold the door to a secure building, what would you do?",
        required: true,
        options: [
          { value: "always_hold", label: "Hold it — seems rude not to" },
          { value: "sometimes_hold", label: "Depends on how they look" },
          { value: "ask_first", label: "Ask a question first" },
          { value: "redirect", label: "Redirect them to the intercom or security" },
        ],
      },
    ],
    post: SHARED_POST,
  },

  pretexting: {
    pre: [
      ...SHARED_PRE,
      {
        id: "authority_response",
        type: "radio",
        text: "If someone claiming to be from IT support called and asked for your password to fix an urgent issue, what would you do?",
        required: true,
        options: [
          { value: "give_password", label: "Give it — they're IT, they can be trusted" },
          { value: "hesitate_give", label: "Hesitate, but probably give it" },
          { value: "verify_first", label: "Verify their identity before doing anything" },
          { value: "refuse_report", label: "Refuse and report the call" },
        ],
      },
    ],
    post: SHARED_POST,
  },
};