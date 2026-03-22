import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

describe("campaign website", () => {
  let document;

  beforeEach(() => {
    const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
    document = new JSDOM(html).window.document;
  });

  it("has the expected page title", () => {
    expect(document.title).toBe("Vote Robert Peay | County Commission District 4");
  });

  it("shows nav links in the required order", () => {
    const nav = document.querySelector('header nav[aria-label="Primary"]');
    const labels = [...nav.querySelectorAll("a")].map((a) => a.textContent.trim());
    expect(labels).toEqual(["About", "District 4", "Vision", "Voting", "Contact"]);
  });

  it("uses the candidate portrait asset", () => {
    const img = document.querySelector('img[alt="Portrait of Robert Peay"]');
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("assets/robertpeay.jpg");
  });

  it("contains voting links with the expected URLs", () => {
    const expectedUrls = [
      "https://rutherfordcountytn.gov/voting-centers",
      "https://rutherfordcountytn.gov/early-voting",
      "https://rutherfordcountytn.gov/vertical/sites/%7B0DE57B3C-95FA-46CF-BF78-CE4E5703EB9C%7D/uploads/Voters_schedule_2026.pdf"
    ];

    const links = [...document.querySelectorAll('section#voting a')].map((a) =>
      a.getAttribute("href")
    );

    expectedUrls.forEach((url) => {
      expect(links).toContain(url);
    });
  });

  it("contains the facebook link in contact section", () => {
    const facebookLink = document.querySelector('section#contact a[href="https://www.facebook.com/RobertWPeay"]');
    expect(facebookLink).toBeTruthy();
    expect(facebookLink.textContent.trim()).toBe("Robert Peay for Commission");
  });

  it("shows updated campaign disclaimer in footer", () => {
    const footerText = document.querySelector("footer").textContent;
    expect(footerText).toContain("Paid for by Friends of Robert Peay.");
  });
});
