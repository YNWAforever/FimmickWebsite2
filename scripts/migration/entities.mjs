/**
 * HTML entity decoding for the legacy WordPress capture. The capture double-escaped some titles
 * ("Tips &amp;amp; Considerations"), so decoding repeats until the text stops changing.
 */
const named = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", hellip: "…", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", middot: "·", bull: "•", copy: "©", reg: "®", trade: "™" };

function decodeOnce(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : Number(body.slice(1));
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return named[body.toLowerCase()] ?? match;
  });
}

export function decodeEntities(s) {
  let current = s;
  for (let i = 0; i < 4; i++) {
    const next = decodeOnce(current);
    if (next === current) break;
    current = next;
  }
  return current;
}
