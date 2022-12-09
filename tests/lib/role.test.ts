import { useSession } from "next-auth/react";
import { expect, test } from "vitest";

import { ExtendedSession } from "@/types/Session";

test("Role verifications", () => {
  const { data: session } = useSession();
  const { user } = (session as ExtendedSession) || {};

  expect(user?.role).toBe("USER");
});
