import { expect, test, vi } from "vitest";
import { asString } from "@/tests/as";
import { checkEmail } from "@/lib/validators/email";

test("email validation", () => {
  // valid emails
  expect(checkEmail("jean.bon@viacesi.fr")).toBe(true);
  expect(checkEmail("jean.bon@cesi.fr")).toBe(true);

  // invalid emails
  expect(checkEmail("jean.bon@gmail.com")).toBe(false);
  expect(checkEmail("")).toBe(false);

  // error handling
  expect(checkEmail(asString(null))).toBe(false);
  expect(checkEmail(asString(undefined))).toBe(false);
});
