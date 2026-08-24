/*
  M Studio — new-client project questionnaire.

  This file is the single source of truth for the questionnaire. The client
  form (components/Questionnaire.tsx) renders from it, and the API route
  (app/api/questionnaire/route.ts) validates and formats the notification
  email from it too.

  That shared definition is the point: the server derives every label,
  option, and length cap from here rather than trusting what the browser
  posts, so a forged payload can't inject its own question text into the
  email that lands in Meg's inbox. Same principle as TOOL_LABELS in
  /api/tool-lead — the client sends field ids and values, nothing else.
*/

export type QuestionField =
  | {
      kind: "text";
      id: string;
      label: string;
      /** Rendered under the label as smaller guidance copy. */
      hint?: string;
      placeholder?: string;
      type?: "text" | "email" | "url";
      required?: boolean;
      autoComplete?: string;
      /** Sits two-across on desktop with the adjacent half-width field. */
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
      kind: "select";
      id: string;
      label: string;
      hint?: string;
      options: string[];
      half?: boolean;
    }
  | {
      kind: "checkboxes";
      id: string;
      label: string;
      hint?: string;
      options: string[];
    };

export type QuestionStep = {
  /** Zero-padded step number shown in the eyebrow ("01 — The Basics"). */
  index: string;
  eyebrow: string;
  title: string;
  /** Optional lead-in under the step title. */
  intro?: string;
  fields: QuestionField[];
};

/** Longest answer we accept for any single free-text field. */
export const MAX_FIELD_LEN = 4000;

export const questionnaireSteps: QuestionStep[] = [
  {
    index: "01",
    eyebrow: "The Basics",
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
        label: "Current website",
        hint: "Leave blank if you don't have one yet.",
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
        hint: "The person you'd happily take ten more of.",
      },
    ],
  },
  {
    index: "02",
    eyebrow: "Why Now",
    title: "What's prompting this?",
    fields: [
      {
        kind: "textarea",
        id: "whyNow",
        label: "What's driving the redesign — or the new site?",
        hint: "Outdated look, no site yet, not getting leads, doesn't work on mobile…",
        required: true,
      },
      {
        kind: "textarea",
        id: "frustration",
        label: "What frustrates you most about your current site, or the lack of one?",
      },
    ],
  },
  {
    index: "03",
    eyebrow: "Goals",
    title: "What should this site do for you?",
    intro: "Check everything that applies — most businesses pick two or three.",
    fields: [
      {
        kind: "checkboxes",
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
        label: "Another goal we missed?",
        hint: "Optional.",
      },
    ],
  },
  {
    index: "04",
    eyebrow: "Scope",
    title: "What's on the site?",
    fields: [
      {
        kind: "textarea",
        id: "pages",
        label: "Roughly how many pages, and which ones?",
        hint: "e.g. Home, About, Services, Contact. A rough guess is fine.",
      },
      {
        kind: "checkboxes",
        id: "features",
        label: "Features",
        hint: "Do you need any of these?",
        options: [
          "Online booking or scheduling",
          "Online payments or a store",
          "Blog or news section",
          "Photo gallery or portfolio",
          "Customer login / account area",
          "Email newsletter signup",
          "Live chat",
          "Multiple locations",
        ],
      },
      {
        kind: "text",
        id: "featOther",
        label: "Another feature you have in mind?",
        hint: "Optional.",
      },
    ],
  },
  {
    index: "05",
    eyebrow: "Content & Assets",
    title: "What do you already have?",
    intro: "No wrong answers here — missing pieces are normal, and we can fill them.",
    fields: [
      {
        kind: "select",
        id: "hasLogo",
        label: "Logo",
        options: ["Yes, ready to go", "No, need one", "Have one, needs a refresh"],
        half: true,
      },
      {
        kind: "select",
        id: "hasPhotos",
        label: "Photos",
        options: ["Yes, ready to go", "No, need them", "Some, need more"],
        half: true,
      },
      {
        kind: "select",
        id: "hasCopy",
        label: "Written content",
        options: [
          "Yes, I'll provide it",
          "No, need help writing it",
          "Some, need help with the rest",
        ],
      },
    ],
  },
  {
    index: "06",
    eyebrow: "Look & Feel",
    title: "What's the vibe?",
    fields: [
      {
        kind: "textarea",
        id: "loveSites",
        label: "Sites you love — yours, competitors', or anything at all",
        hint: "Links are the fastest way to show us. Say what you like about each if you can.",
      },
      {
        kind: "textarea",
        id: "avoidSites",
        label: "Anything you want to avoid looking like?",
      },
      {
        kind: "text",
        id: "colors",
        label: "Brand colors already set, or open to suggestions?",
      },
    ],
  },
  {
    index: "07",
    eyebrow: "Practical Stuff",
    title: "Timeline and logistics",
    fields: [
      {
        kind: "text",
        id: "domain",
        label: "Do you have a domain already? Where's it registered?",
        hint: "GoDaddy, Namecheap, Google Domains… or \"not yet\".",
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
        hint: "Totally fine to say \"not sure yet\" — this just helps us scope realistically.",
      },
    ],
  },
  {
    index: "08",
    eyebrow: "Almost Done",
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

/** Answers as they travel over the wire: text fields and checkbox arrays. */
export type Answers = Record<string, string | string[]>;
