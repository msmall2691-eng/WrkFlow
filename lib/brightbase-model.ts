/*
  BrightBase's data model, for the "How the data fits together" section of
  /brightbase.

  Checked against backend/database/models.py and utils/contacts.py in
  msmall2691-eng/Bright-Space on Nov 1, 2026. Every "links" entry is a real
  foreign key on that table. Keep it that way: if the schema changes, change
  this file, and never list a link that is planned rather than built.
*/

export type ModelNode = {
  id: string;
  label: string;
  /** Table name in the real schema, shown in mono as data. */
  table: string;
  group: "identity" | "sales" | "work" | "money" | "talk";
  body: string;
  /** What this record points at (its foreign keys), in plain words. */
  links: string[];
};

export const modelGroups: { id: ModelNode["group"]; label: string }[] = [
  { id: "identity", label: "Who they are" },
  { id: "sales", label: "Winning the work" },
  { id: "work", label: "Doing the work" },
  { id: "money", label: "Getting paid" },
  { id: "talk", label: "Every conversation" },
];

export const client = {
  label: "Client",
  table: "clients",
  body: "The hub. Every lead, quote, job, invoice and message points back to one client record, so the whole history of a customer is one click away.",
};

export const modelNodes: ModelNode[] = [
  {
    id: "emails",
    label: "Emails",
    table: "contact_emails",
    group: "identity",
    body: "A client can have any number of email addresses, each with where it came from (website, Gmail, typed in). Any one of them finds the client.",
    links: ["Client"],
  },
  {
    id: "phones",
    label: "Phones",
    table: "contact_phones",
    group: "identity",
    body: "Any number of phone numbers, stored in one standard format with mobile, office or home noted. Any one of them finds the client.",
    links: ["Client"],
  },
  {
    id: "requests",
    label: "Requests",
    table: "lead_intakes",
    group: "sales",
    body: "Every inbound lead from a website form or a Facebook or Instagram ad, kept as it arrived, then attached to the client it belongs to.",
    links: ["Client"],
  },
  {
    id: "deals",
    label: "Deals",
    table: "opportunities",
    group: "sales",
    body: "One piece of work from first contact to won. Quotes, jobs, invoices, recurring schedules and conversations can all point at the same deal.",
    links: ["Client"],
  },
  {
    id: "quotes",
    label: "Quotes",
    table: "quotes",
    group: "sales",
    body: "Line items, a customer message and a public page the customer accepts from. An accepted quote becomes a job or a recurring schedule.",
    links: ["Client", "Property", "Request", "Deal"],
  },
  {
    id: "properties",
    label: "Properties",
    table: "properties",
    group: "work",
    body: "Each place the crew cleans, with access details, checklist, photos and crew notes. Rental properties carry their booking calendar feeds.",
    links: ["Client"],
  },
  {
    id: "recurring",
    label: "Recurring schedules",
    table: "recurring_schedules",
    group: "work",
    body: "Weekly, every-other-week or monthly service that creates the next visits on its own, with skips and reschedules kept as exceptions.",
    links: ["Client", "Property", "Quote", "Deal"],
  },
  {
    id: "jobs",
    label: "Jobs",
    table: "jobs",
    group: "work",
    body: "A single visit. It knows where it came from: a quote, a recurring schedule, or a guest checkout on a rental calendar.",
    links: ["Client", "Property", "Quote", "Recurring schedule", "Calendar booking", "Deal"],
  },
  {
    id: "invoices",
    label: "Invoices",
    table: "invoices",
    group: "money",
    body: "Billed from the job, paid online through Stripe, chased automatically when overdue.",
    links: ["Client", "Job", "Deal"],
  },
  {
    id: "payouts",
    label: "Sub payouts",
    table: "sub_payouts",
    group: "money",
    body: "What each subcontractor is owed per job, paid out through Stripe Connect, with year-to-date totals for 1099s.",
    links: ["Job", "Subcontractor"],
  },
  {
    id: "conversations",
    label: "Conversations",
    table: "conversations · messages",
    group: "talk",
    body: "Email and text threads, each one attached to the client, and to the job or deal it is about.",
    links: ["Client", "Job", "Deal"],
  },
  {
    id: "timeline",
    label: "Timeline",
    table: "activities",
    group: "talk",
    body: "One running history per client: every email, text, quote, visit and payment, newest first.",
    links: ["Client", "Deal", "Job", "Message"],
  },
];

/* How an incoming email, text or request finds its client (utils/contacts.py). */
export const matching = [
  {
    step: "Email",
    body: "Look for the address on the client's main email, then on every extra email on file. Case does not matter.",
  },
  {
    step: "Phone",
    body: "Put the number in one standard format, check main and extra numbers, then fall back to the last ten digits, so (207) 555-0101 and +12075550101 are the same person.",
  },
  {
    step: "New lead",
    body: "Still no match on a new request? Create a lead client and record that email or number as its first contact. A request only ever matches clients of the business it came in for.",
  },
];

export const modelFacts = [
  { value: "51", label: "tables" },
  { value: "141", label: "database migrations" },
  { value: "1", label: "client record behind every lead, job and payment" },
];
