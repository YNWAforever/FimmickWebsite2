/**
 * `<` (so no value such as "</script>" can close the tag) and U+2028 / U+2029 (line terminators to
 * older JavaScript parsers), written as \u escapes; JSON.parse reads them back unchanged.
 */
const unsafe = new RegExp(`[<${String.fromCharCode(0x2028, 0x2029)}]`, "g");
const escape = (c: string) => `${String.fromCharCode(92)}u${c.charCodeAt(0).toString(16).padStart(4, "0")}`;

/** Structured data. Content is our own serialised object, escaped for a script element. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(unsafe, escape) }} />;
}
