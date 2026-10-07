import type { L } from "@/lib/i18n";

/** Offering availability — what can be bought today. */
export type Availability = "available" | "configured" | "discuss";
/** Example mode — what the public demonstration actually is. */
export type ExampleMode = "illustrative-sample" | "recorded-demonstration" | "live-product";

export type SolutionId = "market-intelligence" | "content-production" | "customer-engagement" | "website-operations";
export type ProductId = "social-listening" | "aiso" | "creativemax" | "whatsapp-aigc" | "customer-ops" | "website-cms";
export type ExampleId = "intelligence" | "content" | "follow-up" | "website-ops";
export type WorkstreamId = "ai-readiness-maturity" | "strategy-roadmap" | "workflow-agent-design" | "governance-adoption";
export type ProgrammeStepId = "audit" | "identify" | "design" | "integrate" | "enable" | "govern";
export type ServiceObjective = "acquire" | "convert" | "retain" | "understand" | "automate" | "scale";
export type ServiceId =
  | "ai-transformation"
  | "digitalmarketing"
  | "marketing-automation"
  | "crm-sales"
  | "seo-aeo"
  | "social-listening"
  | "koc-community"
  | "ecommerce-growth"
  | "digital-experience"
  | "business-intelligence"
  | "data-hub"
  | "content-creative"
  | "customer-experience"
  | "workflow-automation"
  | "whatsapp-automation"
  | "ai-training";
export type IndustryId =
  | "retail-ecommerce"
  | "financial-services"
  | "hospitality-travel"
  | "beauty-luxury"
  | "food-beverage"
  | "property-real-estate"
  | "healthcare-wellness"
  | "b2b-professional-services";
export type MemberId = "aip" | "kocmax" | "adfocate" | "kinnso" | "50-add-oil" | "eldage";
export type CaseKind = "client-work" | "internal-application" | "recorded-demonstration" | "illustrative-sample";

export type TitledCopy = { title: L; copy: L };

export type Solution = {
  /** Search title and description (award pass 2, 8.1.2); pages fall back to the name and summary. */
  seoTitle?: L;
  seoDescription?: L;
  id: SolutionId;
  number: string;
  name: L;
  short: L;
  job: L;
  /** Phrase inside `job` set as the H1 accent (detail-page headline = `job`). */
  headlineAccent?: L;
  problem: L;
  deliverable: L;
  inputs: L<string[]>;
  outputs: L<string[]>;
  products: ProductId[];
  example: ExampleId;
  workflow: TitledCopy[];
  humanDecision: L;
  evidence: L;
  startingScope: L;
  faqs: { q: L; a: L }[];
  services: ServiceId[];
  industries: IndustryId[];
};

export type Product = {
  /** Search title and description (award pass 2, 8.1.2); pages fall back to the name and summary. */
  seoTitle?: L;
  seoDescription?: L;
  id: ProductId;
  name: string;
  descriptor: L;
  /** Phrase inside `descriptor` set as the H1 accent (detail-page headline = `descriptor`). */
  headlineAccent?: L;
  solution: SolutionId;
  availability: Availability;
  exampleMode: ExampleMode;
  summary: L;
  whoFor: L;
  supportedActions: L<string[]>;
  exclusions: L<string[]>;
  dependencies: L<string[]>;
  output: L;
  workflow: TitledCopy[];
  distinction: L;
  example: ExampleId;
  faqs: { q: L; a: L }[];
  services: ServiceId[];
};

export type Workstream = {
  id: WorkstreamId;
  code: string;
  name: L;
  leadershipQuestion: L;
  /** Clause of the question set as the H1 accent (award pass 3). */
  questionAccent: L;
  answer: L;
  buyerFit: L;
  problem: L;
  inputs: L<string[]>;
  lenses: TitledCopy[];
  stages: { title: L; copy: L; details: L<string[]> }[];
  artifactLabel: L;
  deliverables: TitledCopy[];
  scope: L;
  services: ServiceId[];
  products: ProductId[];
  related: WorkstreamId[];
};

export type ProgrammeStep = {
  id: ProgrammeStepId;
  number: string;
  name: L;
  decision: L;
  inputs: L;
  deliverable: L;
  humanRole: L;
  workstream?: WorkstreamId;
  service?: ServiceId;
};

export type Service = {
  /** Search title and description (award pass 2, 8.1.2); pages fall back to the name and summary. */
  seoTitle?: L;
  seoDescription?: L;
  id: ServiceId;
  objective: ServiceObjective;
  name: L;
  eyebrow: L;
  /** Phrase inside `eyebrow` set as the H1 accent (detail-page headline = `eyebrow`). */
  headlineAccent?: L;
  summary: L;
  problem: L;
  deliverables: L<string[]>;
  inputs: L<string[]>;
  process: TitledCopy[];
  aiRole: L;
  specialistRole: L;
  reviewResponsibility: L;
  included: L<string[]>;
  excluded: L<string[]>;
  thirdParty: L;
  sample: { label: L; rows: L<[string, string][]> };
  startingScope: L;
  products: ProductId[];
  industries: IndustryId[];
  members: MemberId[];
  workstream?: WorkstreamId;
  /** When the canonical overview lives elsewhere, the service card links there. */
  canonicalPath?: string;
};

export type Industry = {
  /** Search title and description (award pass 2, 8.1.2); pages fall back to the name and summary. */
  seoTitle?: L;
  seoDescription?: L;
  id: IndustryId;
  name: L;
  group: "consumer" | "regulated" | "experience" | "b2b";
  problem: L;
  sources: L<string[]>;
  journey: { step: L; product?: ProductId; human?: boolean; copy: L }[];
  reviewPoints: L<string[]>;
  output: L;
  /** Phrase inside `output` set as the H1 accent (detail-page headline = `output`). */
  headlineAccent?: L;
  transformationNeed: L;
  startingScope: L;
  products: ProductId[];
  services: ServiceId[];
  members: MemberId[];
  proof: L;
  featured?: boolean;
};

export type CaseStudy = {
  /** Search title and description (award pass 2, 8.1.2); pages fall back to the name and summary. */
  seoTitle?: L;
  seoDescription?: L;
  slug: string;
  kind: CaseKind;
  title: L;
  /** Detail-page H1 (award pass 3): what changed, with one accented phrase; the title stays the name. */
  headline?: L;
  headlineAccent?: L;
  sector: L;
  market: L;
  industries: IndustryId[];
  services: ServiceId[];
  products: ProductId[];
  publicationBasis: L;
  /** Omitted when the source record states no period. */
  period?: L;
  context: L;
  problem: L;
  scope: L<string[]>;
  workflowBefore: L<string[]>;
  workflowAfter: L<string[]>;
  humanDecisions: L;
  dataFoundation: L;
  outcome: L;
  limitations?: L;
  reusable: L;
  legacyId?: number;
};

export type ResourceFormat = "article" | "guide" | "video" | "event" | "workshop";
export type ResourceTopic =
  | "ai-transformation"
  | "search-visibility"
  | "customer-crm"
  | "data-intelligence"
  | "commerce"
  | "creators-community"
  | "marketing-channels"
  | "company-news";

export type EcosystemMember = {
  id: MemberId;
  name: string;
  group: "platform" | "creators" | "communities" | "culture";
  role: L;
  relationship: L;
  audience: L;
  need: L;
  offers: L<string[]>;
  scope: L;
  activity: L<string[]>;
  why: L;
  externalUrl?: { url: string; label: L };
  canonicalInternal?: string;
  services: ServiceId[];
  industries: IndustryId[];
  partnershipPrompt: L;
};
