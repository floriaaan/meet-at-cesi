import { expect, test, vi } from "vitest";
import { formatDate, formatRelative } from "@/lib/date";
import { asString } from "@/tests/as";

const SYSTEM_TIME = new Date("2023-01-01T00:00:00.000Z");

test("date format", () => {
  const date = new Date("2022-01-01T00:00:00.000Z");
  const formattedString = "samedi 1 janvier 2022";
  expect(formatDate(date)).toBe(formattedString);

  // error handling
  expect(formatDate(asString(null))).toBe("");
  expect(formatDate(asString(undefined))).toBe("");
});

test("date format with options", () => {
  const date = new Date("2022-01-01T00:00:00.000Z");
  const formattedString = "sam. 1 janv. 2022";
  expect(
    formatDate(date, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  ).toBe(formattedString);

  // error handling
  expect(formatDate(asString(null))).toBe("");
  expect(formatDate(asString(undefined))).toBe("");
});

test("date format relative from now", () => {
  vi.setSystemTime(SYSTEM_TIME);

  expect(formatRelative(new Date("2022-01-01"))).toBe("1 an");
  expect(formatRelative(new Date("2022-12-01"))).toBe("1 mois");
  expect(formatRelative(new Date("2022-12-31"))).toBe("1 jour");
  expect(formatRelative(new Date("2022-12-31T22:00:00.000Z"))).toBe("2 heures");
  expect(formatRelative(new Date("2022-12-31T23:00:00.000Z"))).toBe("1 heure");
  expect(formatRelative(new Date("2022-12-31T23:59:00.000Z"))).toBe("1 minute");
  expect(formatRelative(new Date("2022-12-31T23:59:59.000Z"))).toBe(
    "quelques secondes"
  );

  // error handling
  expect(formatRelative(asString(null))).toBe("");
  expect(formatRelative(asString(undefined))).toBe("");
});
