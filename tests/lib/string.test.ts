import { expect, test } from "vitest";
import { getInitials, getPlural } from "@/lib/string";
import { asNumber, asString } from "@/tests/as";

test("get plural or not if passed number is > 1", () => {
  expect(getPlural(["thé", "café"].length, "mot", "mots")).toBe("mots");
  expect(getPlural(["thé"].length, "mot", "mots")).toBe("mot");
  expect(getPlural([].length, "mot", "mots")).toBe("mot");

  // error handling
  expect(getPlural(asNumber(null), "mot", "mots")).toBe("mot");
  expect(getPlural(asNumber(undefined), "mot", "mots")).toBe("mot");
  expect(getPlural(0, asString(null), "mots")).toBe("");
  expect(getPlural(0, asString(undefined), "mots")).toBe("");
  expect(getPlural(0, "mot", asString(null))).toBe("");
  expect(getPlural(0, "mot", asString(undefined))).toBe("");
});

test("get initials from a name", () => {
  expect(getInitials("Jean Paul")).toBe("JP");
  expect(getInitials("Jean")).toBe("J");
  expect(getInitials("Jean Paul Dupont")).toBe("JPD");
  expect(getInitials("Jean-Paul Dupont")).toBe("JD");

  // error handling
  expect(getInitials(asString(null))).toBe("");
  expect(getInitials(asString(undefined))).toBe("");
});
