import Script from "next/script";
import { gtmId, isProduction } from "@/lib/env";

/**
 * Google Tag Manager, loaded once and only in production.
 *
 * Consent defaults replicate the current fimmick.com configuration observed
 * on 28 Sep 2026 (analytics storage granted; advertising signals denied).
 * Changing this policy is a release-owner decision, not a code default.
 */
export function Gtm() {
  if (!isProduction() || !/^GTM-[A-Z0-9]+$/.test(gtmId)) return null;
  const consent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted'});`;
  const loader = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
  return (
    <>
      <Script id="consent-defaults" strategy="beforeInteractive">{consent}</Script>
      <Script id="gtm-loader" strategy="afterInteractive">{loader}</Script>
    </>
  );
}
