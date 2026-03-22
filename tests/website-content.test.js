import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

test("voting centers link label uses lowercase text", () => {
  assert.match(html, />this website<\/a>/);
  assert.doesNotMatch(html, />This Website<\/a>/);
});

test("footer disclaimer has no trailing period", () => {
  assert.match(html, /Paid for by Friends of Robert Peay<\/p>/);
  assert.doesNotMatch(html, /Paid for by Friends of Robert Peay\.<\/p>/);
});

test("desktop nav keeps requested order", () => {
  const navMatch = html.match(/<nav class="hidden[\s\S]*?<\/nav>/);
  assert.ok(navMatch, "Primary nav was not found");

  const nav = navMatch[0];
  const aboutIndex = nav.indexOf(">About<");
  const districtIndex = nav.indexOf(">District 4<");
  const visionIndex = nav.indexOf(">Vision<");
  const votingIndex = nav.indexOf(">Voting<");
  const contactIndex = nav.indexOf(">Contact<");

  assert.ok(aboutIndex >= 0 && districtIndex > aboutIndex);
  assert.ok(visionIndex > districtIndex);
  assert.ok(votingIndex > visionIndex);
  assert.ok(contactIndex > votingIndex);
});
