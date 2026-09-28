/**
 * Legal policies preserved verbatim from www.fimmick.com (captured
 * 28 Sep 2026, "Last updated: May 2026"). Production publishes them in
 * English on every locale. Do not edit wording here without release-owner
 * approval; any change is a legal decision, not a content edit.
 */
export type Policy = { id: "privacy" | "terms" | "cookies"; title: { en: string; zh: string }; updated: string; sections: { heading: string; body: string[] }[] };

export const policies: Policy[] = [
  {
    id: "privacy",
    title: { en: "Privacy", zh: "私隱政策" },
    updated: "May 2026",
    sections: [
      { heading: "1. Information We Collect", body: ["We collect information you provide directly, such as your name, email address, company name, and phone number when you fill out a contact form, subscribe to our newsletter, or request a demo. We also collect technical data automatically through cookies and similar technologies, including IP address, browser type, pages visited, and time spent on our site."] },
      { heading: "2. How We Use Your Information", body: ["We use your information to respond to your enquiries, provide our services, send marketing communications (with your consent), improve our website and platform, and comply with legal obligations. We do not sell your personal data to third parties."] },
      { heading: "3. Cookies & Tracking", body: ["Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings. For more details, see our Cookies Policy."] },
      { heading: "4. Data Sharing & Third Parties", body: ["We may share your information with trusted service providers who help us operate our website and business (such as email delivery services and analytics providers). These providers are contractually obligated to protect your data and only use it for the specific services we have engaged them for."] },
      { heading: "5. Data Retention", body: ["We retain your personal data for as long as necessary to fulfil the purposes described in this policy, or as required by law. When your data is no longer needed, we securely delete or anonymise it."] },
      { heading: "6. Your Rights", body: ["Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the processing of your personal data. You may also have the right to data portability and to withdraw consent. To exercise any of these rights, contact us at info@fimmick.com."] },
      { heading: "7. Contact Us", body: ["If you have questions about this Privacy Policy or our data practices, please contact us at info@fimmick.com or write to FIMMICK, Hong Kong (HQ). Visit our Contact page for more details."] },
    ],
  },
  {
    id: "cookies",
    title: { en: "Cookies", zh: "Cookie 政策" },
    updated: "May 2026",
    sections: [
      { heading: "1. What Are Cookies", body: ["Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your experience. Cookies may be \"session\" (deleted when you close your browser) or \"persistent\" (remain until they expire or are deleted)."] },
      { heading: "2. Types of Cookies We Use", body: ["Essential Cookies: Required for the website to function properly, such as maintaining your session and remembering your language preference. These cannot be disabled.", "Analytics Cookies: Help us understand how visitors interact with our website by collecting information about pages visited, time on site, and traffic sources. We use Google Analytics for this purpose.", "Functional Cookies: Remember choices you make (such as your language) to provide enhanced features and a more personalised experience.", "Marketing Cookies: Used to deliver relevant advertisements and measure campaign effectiveness. These may be set by our advertising partners."] },
      { heading: "3. Third-Party Cookies", body: ["Some cookies are placed by third-party services we use, including Google Analytics, Google Tag Manager, and social media platforms. These third parties may use cookies to collect information about your online activities across different websites."] },
      { heading: "4. Managing Cookies", body: ["You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies, but doing so may affect the functionality of this and other websites. To learn more about managing cookies, visit your browser's help documentation or aboutcookies.org."] },
      { heading: "5. Updates to This Policy", body: ["We may update this Cookies Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically."] },
      { heading: "6. Contact Us", body: ["For questions about our use of cookies, contact us at info@fimmick.com. See our full Privacy Policy for more information on how we handle your data."] },
    ],
  },
  {
    id: "terms",
    title: { en: "Terms", zh: "條款" },
    updated: "May 2026",
    sections: [
      { heading: "1. Acceptance of Terms", body: ["By accessing or using the FIMMICK website (fimmick.com), our AI Agent Platform, or any of our services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services."] },
      { heading: "2. Services Description", body: ["FIMMICK provides AI business transformation services, including but not limited to AI consulting, digital marketing, data analytics, CRM solutions, marketing automation, and access to the Fimmick AI Agent Platform. Specific service terms may be set out in separate agreements with clients."] },
      { heading: "3. Intellectual Property", body: ["All content on this website — including text, graphics, logos, images, software, and the FIMMICK brand name — is the intellectual property of FIMMICK or its licensors and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our prior written consent."] },
      { heading: "4. Use of Our Platform", body: ["When using the Fimmick AI Agent Platform, you agree not to: upload malicious code, attempt to gain unauthorised access, use the platform for illegal purposes, or violate any applicable laws. We reserve the right to suspend or terminate access for any violation."] },
      { heading: "5. Limitation of Liability", body: ["FIMMICK provides its services on an \"as is\" basis. To the fullest extent permitted by law, we disclaim all warranties and shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services. Our total liability is limited to the amount paid by you for the relevant services in the preceding 12 months."] },
      { heading: "6. Third-Party Links", body: ["Our website may contain links to third-party websites. We are not responsible for the content, policies, or practices of these external sites. Accessing them is at your own risk."] },
      { heading: "7. Governing Law", body: ["These Terms & Conditions are governed by the laws of the Hong Kong Special Administrative Region. Any disputes shall be subject to the exclusive jurisdiction of the courts of Hong Kong."] },
      { heading: "8. Changes to Terms", body: ["We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the updated Terms. We will notify clients of material changes via email or platform notice."] },
      { heading: "9. Contact", body: ["For questions about these Terms, contact us at info@fimmick.com or visit our Contact page."] },
    ],
  },
];
