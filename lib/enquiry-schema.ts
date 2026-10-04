/**
 * The enquiry contract shared by the form (client) and /api/enquiries (server), so the client's
 * `maxLength` and checks can never drift from what the server accepts. Dependency-free: safe to
 * import into client components.
 */
export type { Intent } from "./intent";

/** Field order is the form's DOM order: the first invalid field in this order takes focus. */
export const ENQUIRY_FIELDS = ["name", "company", "email", "work", "phone", "website", "tools", "message"] as const;
export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];
export type EnquiryFields = Record<EnquiryField, string>;

export const ENQUIRY_LIMITS: Record<EnquiryField, number> = { name: 120, company: 160, email: 200, work: 2000, phone: 40, website: 200, tools: 300, message: 3000 };
export const ENQUIRY_REQUIRED: readonly EnquiryField[] = ["name", "company", "email", "work"];
/** Fields that live in the collapsed "Add more detail" disclosure. */
export const ENQUIRY_OPTIONAL_DETAIL: readonly EnquiryField[] = ["phone", "website", "tools", "message"];

export const ENQUIRY_EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
export const ENQUIRY_PHONE = /^[+()\d\s-]{6,40}$/;

export type EnquiryError = "required" | "invalid" | "too_long";

export const emptyEnquiry: EnquiryFields = { name: "", company: "", email: "", work: "", phone: "", website: "", tools: "", message: "" };

/** Validate trimmed values; returns one error per failing field. */
export function validateEnquiry(fields: EnquiryFields): Partial<Record<EnquiryField, EnquiryError>> {
  const errors: Partial<Record<EnquiryField, EnquiryError>> = {};
  for (const name of ENQUIRY_FIELDS) {
    const value = fields[name].trim();
    if (!value) {
      if (ENQUIRY_REQUIRED.includes(name)) errors[name] = "required";
      continue;
    }
    if (value.length > ENQUIRY_LIMITS[name]) errors[name] = "too_long";
    else if (name === "email" && !ENQUIRY_EMAIL.test(value)) errors[name] = "invalid";
    else if (name === "phone" && !ENQUIRY_PHONE.test(value)) errors[name] = "invalid";
  }
  return errors;
}
