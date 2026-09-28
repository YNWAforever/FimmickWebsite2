import type { FunctionId } from "@/content/functions";
import type { CapabilityId } from "@/content/platform-pages";
import type { IndustryId, MemberId, ProductId, ServiceId, SolutionId, WorkstreamId } from "@/content/types";
import { contextQuery, type EnquiryContext } from "./intent";

/** Locale-neutral canonical paths for each record type. */
export const paths = {
  solution: (id: SolutionId) => `/solutions/${id}`,
  product: (id: ProductId) => `/products/${id}`,
  service: (id: ServiceId) => (id === "ai-transformation" ? "/ai-transformation" : `/services/${id}`),
  industry: (id: IndustryId) => `/industries/${id}`,
  workstream: (id: WorkstreamId) => `/ai-transformation/${id}`,
  member: (id: MemberId) => `/fimmick-ecosystem/${id}`,
  function: (id: FunctionId) => `/functions/${id}`,
  capability: (id: CapabilityId) => `/platform/${id}`,
  case: (slug: string) => `/case-studies/${slug}`,
  article: (slug: string) => `/knowledge-hub/${slug}`,
  event: (slug: string) => `/events/${slug}`,
  contact: (context: Partial<EnquiryContext> = {}) => `/contact${contextQuery(context)}`,
};
