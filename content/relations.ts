import { cases } from "./cases";
import { industries } from "./industries";
import { members } from "./ecosystem";
import { products } from "./products";
import { services } from "./services";
import { solutions } from "./solutions";
import { workstreams } from "./transformation";
import type { CaseStudy, IndustryId, MemberId, ProductId, ServiceId, SolutionId, WorkstreamId } from "./types";

/**
 * Relationship registry. Links are derived from explicit fields on each record
 * (never "everything links to everything"), ranked so the most relevant
 * evidence appears first.
 */

const byKindThenTitle = (a: CaseStudy, b: CaseStudy) => (a.kind === b.kind ? 0 : a.kind === "client-work" ? -1 : 1);

export function casesFor(filter: { industry?: IndustryId; service?: ServiceId; product?: ProductId }, limit = 3): CaseStudy[] {
  return cases
    .filter(
      (c) =>
        (filter.industry && c.industries.includes(filter.industry)) ||
        (filter.service && c.services.includes(filter.service)) ||
        (filter.product && c.products.includes(filter.product)),
    )
    .sort(byKindThenTitle)
    .slice(0, limit);
}

export const servicesForProduct = (id: ProductId) => services.filter((s) => s.products.includes(id));
export const industriesForProduct = (id: ProductId) => industries.filter((i) => i.products.includes(id));
export const solutionForProduct = (id: ProductId) => solutions.find((s) => s.products.includes(id))!;
export const productsForSolution = (id: SolutionId) => products.filter((p) => p.solution === id);
export const industriesForService = (id: ServiceId) => industries.filter((i) => i.services.includes(id));
export const servicesForWorkstream = (id: WorkstreamId) => services.filter((s) => s.workstream === id);
export const membersForService = (id: ServiceId) => members.filter((m) => m.services.includes(id));
export const membersForIndustry = (id: IndustryId) => members.filter((m) => m.industries.includes(id));
export const industriesForMember = (id: MemberId) => {
  const member = members.find((m) => m.id === id);
  return member ? industries.filter((i) => member.industries.includes(i.id)) : [];
};
export const workstreamForService = (id: ServiceId) => {
  const ws = services.find((s) => s.id === id)?.workstream;
  return ws ? workstreams.find((w) => w.id === ws) : undefined;
};
