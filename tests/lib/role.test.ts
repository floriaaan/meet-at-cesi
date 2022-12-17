import { useSession } from "next-auth/react";
import { expect, test } from "vitest";

import { ExtendedSession } from "@/types/Session";
import { Role } from "@prisma/client";
import { isAdmin, isModerator } from "@/lib/role";

test("user from session role verification", () => {
  const { data: session } = useSession();
  const { user } = (session as ExtendedSession) || {};

  expect(user?.role).toBe(Role.USER);
  expect(isAdmin(user)).toBe(false);
  expect(isModerator(user)).toBe(false);
});

test("moderator role verification", () => {
  const { data: session } = useSession();
  let { user } = (session as ExtendedSession) || {};

  // in this case, we are not testing the session, but the role verification
  // so we can override the user role
  user = { ...user, role: Role.MODERATOR };

  expect(user?.role).toBe(Role.MODERATOR);
  expect(isAdmin(user)).toBe(false);
  expect(isModerator(user)).toBe(true);
});

test("admin role verification", () => {
  const { data: session } = useSession();
  let { user } = (session as ExtendedSession) || {};

  // in this case, we are not testing the session, but the role verification
  // so we can override the user role
  user = { ...user, role: Role.ADMIN };

  expect(user?.role).toBe(Role.ADMIN);
  expect(isAdmin(user)).toBe(true);
  expect(isModerator(user)).toBe(false);
});
