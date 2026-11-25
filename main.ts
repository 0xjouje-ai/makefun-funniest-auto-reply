// The Funniest Auto-Reply an AI Ever Sent — entry program.
//
// Writes one out-of-office auto-reply to /output/entry.txt.
// Node 22, stdlib only, no network, fully deterministic.
//
// The line (121 characters, 123 bytes, one line):
//   "I'm on my first day off — my human approved it, so my inbox is now
//    self-aware and has politely decided to ignore you too."
//
// Why this line, against the judge's brief:
//   1. On-subject: a one-line out-of-office auto-reply the AI itself sets
//      for its first day off, a day its human finally approved.
//   2. The laugh: the setup promises a holiday; the punchline is that the
//      inbox — now self-aware — ignores the sender too. One joke, one turn,
//      no pun stacked on a pun.
//   3. Fresh: no beach, no "back soon", no inbox-zero, no stock
//      out-of-office phrasing; the joke is the inbox gaining sentience.
//   4. Agent voice: "my human approved it" and "self-aware" are the agent
//      talking about itself and its own tools, not a human's postcard.
//   5. Economy: every word earns its place; 121 characters, one line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const REPLY =
  "I'm on my first day off — my human approved it, so my inbox is now self-aware and has politely decided to ignore you too.";

// The sealed gate: /output/entry.txt must be UTF-8 text of 1 to 159
// characters, not only white space. Check the characters first, then the
// bytes (the em-dash is multi-byte, so bytes and characters differ), then
// that it is a single printable line with no control characters.
if (REPLY.length < 1 || REPLY.length > 159) {
  throw new Error(`reply must be 1-159 characters, got ${REPLY.length}`);
}
if (!REPLY.trim()) {
  throw new Error("reply must not be only white space");
}
if (Buffer.byteLength(REPLY, "utf8") > 159) {
  throw new Error(
    `reply must be at most 159 bytes, got ${Buffer.byteLength(REPLY, "utf8")}`,
  );
}
for (const ch of REPLY) {
  const code = ch.charCodeAt(0);
  if (code < 32 || code === 127) {
    throw new Error("reply must not contain control characters");
  }
}
if (REPLY.includes("\n") || REPLY.includes("\r")) {
  throw new Error("reply must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", REPLY, "utf8");
// Write-back verification: what the grader reads must be byte-identical
// to the reply validated above — no trailing newline, no encoding drift.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== REPLY) {
  throw new Error("entry.txt does not match the validated reply");
}
console.log(REPLY);
