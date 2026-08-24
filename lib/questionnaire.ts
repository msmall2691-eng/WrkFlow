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

  Adding or reordering a question is a change to this file alone: the form,
  the review screen, the validator, and both emails all follow.
*/

export type QuestionField =
  | {
      kind: "text";
      id: string;
      label: string;
      /** Rendered under the label as smaller guidance copy. */
      hint?: string;
      placeholder?: string;
      type?: "text" | "email" | "url" | "tel";
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
          "Cut down the admin work I do by hand",
        ],
      },
      {
        kind: "text",
        id: "goalsOther",
        label: "Another goal we missed?",
      },
      {
        kind: "textarea",
        id: "successMetric",
        label: "Six months in, what would tell you this worked?",
        hint: "More calls? Fewer of the wrong ones? Hours back in your week? Anything you'd actually notice.",
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
      },
      {
        kind: "select",
        id: "audienceDevice",
        label: "Where do your customers usually find you?",
        hint: "Every site we build works on a phone — this just tells us which screen to design for first.",
        options: [
          "Mostly on their phone",
          "Mostly on a computer",
          "A real mix of both",
          "Not sure",
        ],
      },
    ],
  },
  {
    index: "05",
    eyebrow: "The Fun Part",
    title: "Anything you'd enjoy having?",
    intro:
      "The parts that make a site feel alive instead of a brochure. Pick whatever sounds good — we'll tell you honestly what's worth building and what isn't.",
    fields: [
      {
        kind: "checkboxes",
        id: "funExtras",
        label: "Fun extras",
        options: [
          "Live chat or a chatbot",
          "Live data widgets — weather, hours, availability",
          "Light and dark mode",
          "Motion and animation",
          "An interactive calculator or instant quote",
          "A customer portal or dashboard",
          "Map or location finder",
          "Video or photo backgrounds",
          "A hidden easter egg or two",
        ],
      },
      {
        kind: "text",
        id: "funOther",
        label: "Something you saw somewhere and liked?",
      },
    ],
  },
  {
    index: "06",
    eyebrow: "How You Run",
    title: "What does the business run on today?",
    intro:
      "A website is usually the visible part of something bigger. This is where we find the rest.",
    fields: [
      {
        kind: "checkboxes",
        id: "tools",
        label: "Tools in use",
        hint: "Whatever you already use to run the day-to-day.",
        options: [
          "Booking or scheduling software",
          "A CRM or customer list",
          "Point of sale / card payments",
          "Invoicing or accounting software",
          "Email marketing",
          "Spreadsheets — a lot of them",
          "Texting customers from my own phone",
          "Paper, whiteboards, or a notebook",
          "Honestly, it's mostly in my head",
        ],
      },
      {
        kind: "text",
        id: "toolsOther",
        label: "Anything else you rely on?",
      },
      {
        kind: "textarea",
        id: "busywork",
        label: "What repetitive work eats the most of your week?",
        hint: "Typing the same thing into two places, chasing people for details, answering the same question over and over. Even if it seems unrelated to a website — it usually isn't.",
      },
    ],
  },
  {
    index: "07",
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
    index: "08",
    eyebrow: "Look & Feel",
    title: "What's the vibe?",
    fields: [
      {
        kind: "checkboxes",
        id: "aesthetic",
        label: "Aesthetic",
        hint: "Pick two or three that feel right. Contradictions are fine — we'll sort it out.",
        options: [
          "Clean and minimal",
          "Warm and personal",
          "Bold and colorful",
          "Classic and established",
          "Modern and technical",
          "Rugged and outdoorsy",
          "High-end and polished",
          "Playful",
        ],
      },
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
    index: "09",
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
        hint: "A season or a deadline is enough — \"before summer\", \"end of Q2\".",
      },
      {
        kind: "select",
        id: "budget",
        label: "Rough budget range in mind?",
        hint: "A band is plenty, and \"not sure yet\" is a real answer — this just keeps us from scoping something that was never going to fit.",
        options: [
          "Not sure yet — help me figure it out",
          "Under $2,000",
          "$2,000 – $5,000",
          "$5,000 – $10,000",
          "$10,000+",
        ],
      },
    ],
  },
  {
    index: "10",
    eyebrow: "After Launch",
    title: "Who's driving once it's live?",
    intro:
      "Whatever we build is yours to keep either way — this is just about how involved you want to be.",
    fields: [
      {
        kind: "select",
        id: "maintenance",
        label: "How hands-on do you want to be?",
        options: [
          "I'll run it myself — hand it over with the keys",
          "Mostly me, with backup when I get stuck",
          "Split it — you handle the technical side, I'll do content",
          "Hands-off — keep the whole thing running for me",
          "Not sure yet — let's talk it through",
        ],
      },
      {
        kind: "textarea",
        id: "selfServe",
        label: "Anything you'll want to change yourself, often?",
        hint: "Prices, hours, staff, photos, a menu. Worth knowing now — it changes how we build it.",
      },
    ],
  },
  {
    index: "11",
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
        autoComplete: "name",
        half: true,
      },
      {
        kind: "text",
        id: "contactEmail",
        label: "Email",
        hint: "The one thing we do need — it's how we get back to you.",
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

/** Answers as they travel over the wire: text fields and checkbox arrays. */
export type Answers = Record<string, string | string[]>;
