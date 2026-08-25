/*
  M Studio — new-client project questionnaire.

  Single source of truth: the form (components/Questionnaire.tsx) renders
  from this file, and /api/questionnaire validates against it and builds the
  notification email from it. The server never takes a question label from
  the request body, so a forged payload can't inject its own text into the
  inbox.

  The questions are Meg's own — restored from her original Google-form
  prototype, in her order and largely her wording. One linear flow, no
  qualification gate: every lead reaches the inbox and she judges fit
  herself. The AI layers (fast fill on step one, concept generation before
  the final step) ride on top without adding questions.
*/

export type CardOption = {
  value: string;
  /** One-line clarifier under the label. */
  hint?: string;
  /** Small teal badge, e.g. "Most common". */
  badge?: string;
  /** Icon key, resolved to an inline SVG in the form component. */
  icon?: string;
};

export type QuestionField =
  | {
      kind: "text";
      id: string;
      label: string;
      hint?: string;
      placeholder?: string;
      type?: "text" | "email" | "url" | "tel";
      required?: boolean;
      autoComplete?: string;
      half?: boolean;
    }
  | {
      kind: "textarea";
      id: string;
      label: string;
      hint?: string;
      placeholder?: string;
      required?: boolean;
    }
  | {
      /** Single-select option cards (kept for future steps; unused today). */
      kind: "cards";
      id: string;
      label: string;
      hint?: string;
      options: CardOption[];
      multi?: boolean;
      required?: boolean;
    }
  | {
      /** Compact multi-select chips. */
      kind: "chips";
      id: string;
      label: string;
      hint?: string;
      options: string[];
    }
  | {
      kind: "select";
      id: string;
      label: string;
      hint?: string;
      options: string[];
      half?: boolean;
    };

export type QuestionStep = {
  id: string;
  /** Kicker eyebrow, e.g. "01 — The Basics". */
  kicker: string;
  timeHint: string;
  title: string;
  intro?: string;
  /** Teal milestone banner shown at the top of this step. */
  milestone?: string;
  fields: QuestionField[];
};

/** Longest answer we accept for any single free-text field. */
export const MAX_FIELD_LEN = 4000;

export const questionnaireSteps: QuestionStep[] = [
  {
    id: "basics",
    kicker: "01 — The Basics",
    timeHint: "~1 min",
    title: "Tell us about the business",
    fields: [
      {
        kind: "text",
        id: "bizName",
        label: "Business name",
        required: true,
        autoComplete: "organization",
      },
      {
        kind: "text",
        id: "currentSite",
        label: "Current website (if you have one)",
        type: "url",
        placeholder: "https://",
        autoComplete: "url",
      },
      {
        kind: "textarea",
        id: "whatYouDo",
        label: "What does your business do, in a sentence or two?",
        required: true,
      },
      {
        kind: "textarea",
        id: "idealCustomer",
        label: "Who's your ideal customer?",
      },
    ],
  },
  {
    id: "whynow",
    kicker: "02 — Why Now",
    timeHint: "~1 min",
    title: "What's prompting this?",
    fields: [
      {
        kind: "textarea",
        id: "whyNow",
        label: "What's driving the redesign — or the new site?",
        hint: "Outdated look, no site yet, not getting leads, doesn't work on mobile…",
      },
      {
        kind: "textarea",
        id: "frustration",
        label: "What frustrates you most about your current site — or the lack of one?",
      },
    ],
  },
  {
    id: "goals",
    kicker: "03 — Goals",
    timeHint: "~30 sec",
    title: "What should this site do for you?",
    intro: "Check everything that applies.",
    fields: [
      {
        kind: "chips",
        id: "goals",
        label: "Goals",
        options: [
          "Get people to call, email, or text me",
          "Let people book or schedule online",
          "Sell products online",
          "Show off my work or portfolio",
          "Collect leads and quote requests",
          "Build credibility and look professional",
        ],
      },
      {
        kind: "text",
        id: "goalsOther",
        label: "Other goal",
      },
    ],
  },
  {
    id: "scope",
    kicker: "04 — Scope",
    timeHint: "~40 sec",
    title: "What's on the site?",
    fields: [
      {
        kind: "text",
        id: "pages",
        label: "Roughly how many pages, and which ones?",
        hint: "e.g. Home, About, Services, Contact.",
      },
      {
        kind: "chips",
        id: "features",
        label: "Do you need any of these?",
        options: [
          "Online booking / scheduling",
          "Online payments / store",
          "Blog or news section",
          "Photo gallery / portfolio",
          "Customer login / account area",
          "Email newsletter signup",
          "Live chat",
          "Multiple locations",
        ],
      },
      {
        kind: "text",
        id: "featOther",
        label: "Other feature",
      },
    ],
  },
  {
    id: "assets",
    kicker: "05 — Content & Assets",
    timeHint: "~20 sec",
    title: "What do you already have?",
    milestone: "✓ Over halfway.",
    fields: [
      {
        kind: "select",
        id: "hasLogo",
        label: "Logo?",
        options: ["Yes", "No", "Have one, needs refresh"],
        half: true,
      },
      {
        kind: "select",
        id: "hasPhotos",
        label: "Photos?",
        options: ["Yes", "No", "Some"],
        half: true,
      },
      {
        kind: "select",
        id: "hasCopy",
        label: "Written content / copy?",
        options: [
          "Yes, I'll provide it",
          "No, need help writing it",
          "Some, need help with the rest",
        ],
      },
    ],
  },
  {
    id: "look",
    kicker: "06 — Look & Feel",
    timeHint: "~40 sec",
    title: "What's the vibe?",
    fields: [
      {
        kind: "textarea",
        id: "loveSites",
        label: "Sites you love — yours or competitors' — links welcome",
      },
      {
        kind: "textarea",
        id: "avoidSites",
        label: "Anything you want to avoid looking like?",
      },
      {
        kind: "text",
        id: "brandColors",
        label: "Brand colors already set, or open to suggestions?",
      },
    ],
  },
  {
    id: "practical",
    kicker: "07 — Practical Stuff",
    timeHint: "~40 sec",
    title: "Timeline and logistics",
    fields: [
      {
        kind: "text",
        id: "domain",
        label: "Do you have a domain already? Where's it registered?",
      },
      {
        kind: "text",
        id: "timeline",
        label: "When do you need this live?",
      },
      {
        kind: "text",
        id: "budget",
        label: "Rough budget range in mind?",
        hint: "Totally fine to say “not sure yet”.",
      },
    ],
  },
  {
    id: "finish",
    kicker: "08 — Almost Done",
    timeHint: "~30 sec",
    title: "Anything else, and how to reach you",
    fields: [
      {
        kind: "textarea",
        id: "anythingElse",
        label: "Anything else we should know?",
      },
      {
        kind: "text",
        id: "contactName",
        label: "Your name",
        required: true,
        autoComplete: "name",
        half: true,
      },
      {
        kind: "text",
        id: "contactEmail",
        label: "Email",
        type: "email",
        required: true,
        autoComplete: "email",
        half: true,
      },
    ],
  },
];

/** Flat field lookup, used by both the form and the server validator. */
export const questionnaireFields: Map<string, QuestionField> = new Map(
  questionnaireSteps.flatMap((step) => step.fields.map((f) => [f.id, f] as const)),
);

/** Answers as they travel over the wire: text fields and multi-select arrays. */
export type Answers = Record<string, string | string[]>;
