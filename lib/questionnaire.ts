/*
  M Studio — new-client intake, two-phase edition.

  This file is the single source of truth for the questionnaire. The client
  form (components/Questionnaire.tsx) renders from it, and the API route
  (app/api/questionnaire/route.ts) validates and formats the notification
  email from it too. The server derives every label, option, and length cap
  from here rather than trusting what the browser posts, so a forged payload
  can't inject its own question text into the email that lands in Meg's
  inbox.

  Structure: a short Phase 1 "fit check" (four taps), a routing gate, then a
  longer Phase 2 "project details". The gate exists to qualify leads before
  they invest ten minutes: a visitor whose budget or timeline clearly fits a
  premade M Linx kit better is told so up front — with a "continue anyway"
  escape hatch, never a dead end.
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
      /** Single-select option cards. Continue is gated until one is picked. */
      kind: "cards";
      id: string;
      label: string;
      hint?: string;
      options: CardOption[];
      /** Multi-select variant (goals). Not gated. */
      multi?: boolean;
      required?: boolean;
    }
  | {
      /** Compact multi-select chips (features, tools). */
      kind: "chips";
      id: string;
      label: string;
      hint?: string;
      options: string[];
    }
  | {
      /** Compact native dropdown — for short single-choice questions where a
          card per option would eat the screen. */
      kind: "select";
      id: string;
      label: string;
      hint?: string;
      options: string[];
      half?: boolean;
    };

export type QuestionStep = {
  id: string;
  /** 1 = fit check, 2 = project details. Drives progress weighting. */
  phase: 1 | 2;
  /** Kicker line, e.g. "The basics · 1 of 4". */
  kicker: string;
  /** Honest time estimate shown next to the kicker. */
  timeHint: string;
  title: string;
  intro?: string;
  /** Teal milestone banner shown at the top of this step. */
  milestone?: string;
  fields: QuestionField[];
};

/** Longest answer we accept for any single free-text field. */
export const MAX_FIELD_LEN = 4000;

/* ------------------------------------------------------------ answers that
   the routing gate reads. Kept as named constants so the rule below, the
   form, and the server can never disagree on the exact strings. */
export const BUDGET_UNDER_500 = "Under $500";
export const TIMELINE_THIS_WEEK = "This week";

/**
 * The routing rule. True → soft-redirect to M Linx (with an escape hatch).
 * "No idea yet" budget qualifies — honesty is not punished.
 */
export function shouldRedirect(answers: Record<string, unknown>): boolean {
  return (
    answers.budget === BUDGET_UNDER_500 || answers.timeline === TIMELINE_THIS_WEEK
  );
}

export const questionnaireSteps: QuestionStep[] = [
  /* ---------------------------------------------------- Phase 1: fit check */
  {
    id: "bizType",
    phase: 1,
    kicker: "The basics · 1 of 4",
    timeHint: "~10 sec",
    title: "What kind of business is this for?",
    fields: [
      {
        kind: "cards",
        id: "bizType",
        label: "Business type",
        required: true,
        options: [
          {
            value: "Service business",
            hint: "Cleaning, trades, landscaping, care, repair — you go to the customer.",
            icon: "wrench",
          },
          {
            value: "Property or short-term rental",
            hint: "Rentals, Airbnb/VRBO, property management.",
            icon: "home",
          },
          {
            value: "Store or e-commerce",
            hint: "You sell products, online or in person.",
            icon: "cart",
          },
          {
            value: "Something else",
            hint: "Consulting, professional practice, nonprofit, personal project…",
            icon: "sparkle",
          },
        ],
      },
    ],
  },
  {
    id: "budget",
    phase: 1,
    kicker: "The basics · 2 of 4",
    timeHint: "~10 sec",
    title: "What budget range are you working with?",
    intro:
      "This shapes what we recommend, not what we charge — and “not sure yet” is a perfectly good answer.",
    fields: [
      {
        kind: "cards",
        id: "budget",
        label: "Budget range",
        required: true,
        options: [
          {
            value: BUDGET_UNDER_500,
            hint: "Premade tools & templates territory.",
          },
          {
            value: "$500–$2,000",
            hint: "Starter site range.",
            badge: "Founding spots left",
          },
          {
            value: "$2,000–$7,500",
            hint: "Site plus automations or integrations.",
          },
          {
            value: "$7,500+",
            hint: "Custom software, CRM, full systems.",
          },
          {
            value: "Not sure yet",
            hint: "Completely fine — we'll help you size it.",
          },
        ],
      },
    ],
  },
  {
    id: "timeline",
    phase: 1,
    kicker: "The basics · 3 of 4",
    timeHint: "~10 sec",
    title: "What's your timeline?",
    fields: [
      {
        kind: "cards",
        id: "timeline",
        label: "Timeline",
        required: true,
        options: [
          {
            value: TIMELINE_THIS_WEEK,
            hint: "A premade option may serve you better.",
          },
          {
            value: "In the next month",
            hint: "Fits a Starter site build (2–3 weeks).",
            badge: "Most common",
          },
          { value: "1–3 months" },
          { value: "Flexible" },
        ],
      },
    ],
  },
  {
    id: "decider",
    phase: 1,
    kicker: "The basics · 4 of 4",
    timeHint: "~10 sec",
    title: "Who's involved in the decision?",
    fields: [
      {
        kind: "cards",
        id: "decider",
        label: "Decision-maker",
        required: true,
        options: [
          { value: "Just me — I can approve it" },
          { value: "Me and a partner or team" },
          {
            value: "Still exploring",
            hint: "We'll send information you can share — not a sales pitch.",
          },
        ],
      },
    ],
  },

  /* ----------------------------------------------- Phase 2: project details */
  {
    id: "business",
    phase: 2,
    kicker: "Project details · 1 of 9",
    timeHint: "~1 min",
    title: "Tell us about the business",
    intro:
      "Plain words are perfect. This is what your scope — and your homepage concepts — get built from.",
    fields: [
      {
        kind: "text",
        id: "bizName",
        label: "Business name",
        autoComplete: "organization",
      },
      {
        kind: "textarea",
        id: "whatYouDo",
        label: "What do you do, in a sentence or two?",
        hint: "What you offer, who it's for, and where — e.g. “vacation-rental cleaning across Midcoast Maine”.",
      },
      {
        kind: "text",
        id: "idealCustomer",
        label: "Who's your ideal customer?",
        hint: "The person you'd gladly take ten more of.",
      },
      {
        kind: "text",
        id: "different",
        label: "What sets you apart?",
        hint: "One honest line is plenty — it often becomes the headline.",
      },
    ],
  },
  {
    id: "goals",
    phase: 2,
    kicker: "Project details · 2 of 9",
    timeHint: "~30 sec",
    title: "What should the site accomplish?",
    intro: "Pick everything that applies — most businesses pick two or three.",
    fields: [
      {
        kind: "cards",
        id: "goals",
        label: "Goals",
        multi: true,
        options: [
          {
            value: "Get people to call, email, or text me",
            badge: "Most pick this",
          },
          { value: "Let people book or schedule online" },
          { value: "Sell products or take payments" },
          { value: "Reduce manual admin work" },
          { value: "Build credibility with a professional presence" },
        ],
      },
    ],
  },
  {
    id: "scope",
    phase: 2,
    kicker: "Project details · 3 of 9",
    timeHint: "~30 sec",
    title: "What's on the site?",
    fields: [
      {
        kind: "chips",
        id: "features",
        label: "Features",
        hint: "Tap anything you know you'll need.",
        options: [
          "Online booking",
          "Payments / store",
          "Photo gallery",
          "Blog / news",
          "Customer login",
          "Newsletter signup",
          "Live chat",
          "Multiple locations",
        ],
      },
      {
        kind: "text",
        id: "pages",
        label: "Pages you know you want",
        hint: "e.g. Home, Services, About, Contact. A rough guess is fine.",
      },
    ],
  },
  {
    id: "style",
    phase: 2,
    kicker: "Project details · 4 of 9",
    timeHint: "~30 sec",
    title: "What should it feel like?",
    intro:
      "A few words are enough to point the design in the right direction — contradictions are fine, we'll reconcile them.",
    fields: [
      {
        kind: "chips",
        id: "styleWords",
        label: "Feel",
        hint: "Tap any that fit.",
        options: [
          "Warm & personal",
          "Clean & modern",
          "Bold & confident",
          "Classic & established",
          "High-end & polished",
          "Playful",
          "Rugged & outdoorsy",
          "Coastal",
        ],
      },
      {
        kind: "text",
        id: "brandColors",
        label: "Brand colors, if you have them",
        hint: "Names are fine — “navy and gold”, “forest green”. Leave blank and we'll propose.",
      },
      {
        kind: "text",
        id: "loveSites",
        label: "A site or two whose look you like",
        hint: "Links or names — competitors or not.",
      },
      {
        kind: "text",
        id: "avoidSites",
        label: "Anything you don't want to look like?",
      },
    ],
  },
  {
    id: "assets",
    phase: 2,
    kicker: "Project details · 5 of 9",
    timeHint: "~20 sec",
    title: "What do you already have?",
    intro: "Missing pieces are normal — we fill them all the time.",
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
        options: ["Yes, I'll provide it", "No, need help writing it", "Some, need help with the rest"],
      },
    ],
  },
  {
    id: "tools",
    phase: 2,
    kicker: "Project details · 6 of 9",
    timeHint: "~30 sec",
    title: "What does the business run on today?",
    intro:
      "The most useful question we ask — it tells us what to connect, what to replace, and what to leave alone.",
    milestone: "✓ Over halfway. About 2 minutes left…",
    fields: [
      {
        kind: "chips",
        id: "tools",
        label: "Current tools",
        options: [
          "Jobber",
          "Housecall Pro",
          "QuickBooks",
          "Square / Stripe",
          "Google Calendar",
          "Airbnb / VRBO",
          "Spreadsheets",
          "Paper, whiteboard, or memory",
          "Other",
        ],
      },
      {
        kind: "text",
        id: "teamSize",
        label: "How many people would use the system?",
        hint: "Just you? A crew of five? A rough number helps.",
      },
    ],
  },
  {
    id: "pain",
    phase: 2,
    kicker: "Project details · 7 of 9",
    timeHint: "~1 min",
    title: "What's not working today?",
    fields: [
      {
        kind: "textarea",
        id: "whyNow",
        label: "What's prompting this now?",
        hint: "New business, outdated site, growth, a competitor…",
      },
      {
        kind: "textarea",
        id: "painPoint",
        label: "What costs you the most time or business right now?",
        placeholder:
          "e.g. “every booking gets typed into two systems”, “customers call with questions a site should answer”, “our current site doesn't work on phones”…"
      },
      {
        kind: "textarea",
        id: "successMetric",
        label: "Six months in, what would tell you this worked?",
        hint: "More calls? Fewer of the wrong ones? Hours back in your week?",
      },
    ],
  },
  {
    id: "logistics",
    phase: 2,
    kicker: "Project details · 8 of 9",
    timeHint: "~30 sec",
    title: "A few practical things",
    fields: [
      {
        kind: "text",
        id: "domain",
        label: "Do you have a domain? Where's it registered?",
        hint: "GoDaddy, Squarespace, “not yet”…",
      },
      {
        kind: "select",
        id: "maintenance",
        label: "Once it's live, who runs it?",
        options: [
          "I'll run it myself — hand over the keys",
          "Mostly me, with backup when stuck",
          "You handle technical, I'll do content",
          "Hands-off — keep it running for me",
          "Not sure yet",
        ],
      },
      {
        kind: "text",
        id: "selfServe",
        label: "Anything you'll want to change yourself, often?",
        hint: "Prices, hours, photos, a menu — it changes how we build.",
      },
    ],
  },
  {
    id: "contact",
    phase: 2,
    kicker: "Project details · 9 of 9",
    timeHint: "~30 sec",
    title: "Where should we send your scope?",
    intro: "A personal reply within 24 hours — a real person, not a sequence.",
    fields: [
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
      {
        kind: "text",
        id: "contactPhone",
        label: "Phone",
        hint: "Only if you'd rather talk than type.",
        type: "tel",
        autoComplete: "tel",
        half: true,
      },
      {
        kind: "select",
        id: "preferredContact",
        label: "Best way to reach you",
        options: ["Email", "Phone call", "Text", "Whatever's easiest"],
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

/*
  Testimonial slot for the qualified "good news" screen. Ships null — it only
  renders once a real, permissioned client quote is configured here. Never
  put a placeholder or invented quote in this object.
*/
export const qualifiedTestimonial: {
  quote: string;
  name: string;
  business: string;
  initials: string;
} | null = null;
