/**
 * Production Knowledge Hub category URLs (captured from the fimmick.com
 * sitemaps). Each maps to the legacy article sections it lists. "Creators"
 * and "SMB" had no matching article section; they map to the closest
 * existing sections and say so on the page.
 */
export const knowledgeCategories: { slug: string; sections: string[]; consolidated?: boolean }[] = [
  { slug: "AI", sections: ["AI"] },
  { slug: "CRM", sections: ["CRM"] },
  { slug: "Career Tips", sections: ["Career Tips"] },
  { slug: "Community Marketing", sections: ["Community Marketing"] },
  { slug: "Content Marketing", sections: ["Content Marketing"] },
  { slug: "Creators", sections: ["Influencer Marketing", "Community Marketing"], consolidated: true },
  { slug: "Data", sections: ["Data"] },
  { slug: "Ecommerce", sections: ["Ecommerce"] },
  { slug: "Events", sections: ["Events"] },
  { slug: "Facebook", sections: ["Facebook"] },
  { slug: "Google", sections: ["Google"] },
  { slug: "Influencer Marketing", sections: ["Influencer Marketing"] },
  { slug: "Insights", sections: ["Insights"] },
  { slug: "Instagram", sections: ["Instagram"] },
  { slug: "Learning & Culture", sections: ["Learning & Culture"] },
  { slug: "MarTech", sections: ["MarTech", "Marketing Automation"] },
  { slug: "Online Ads", sections: ["Online Ads"] },
  { slug: "Recruitment Marketing", sections: ["Recruitment Marketing"] },
  { slug: "SEO", sections: ["SEO", "SEO / AEO"] },
  { slug: "SMB", sections: ["Ecommerce", "Online Ads"], consolidated: true },
  { slug: "Technology", sections: ["Technology", "Web3"] },
  { slug: "Video", sections: ["Video"] },
];
