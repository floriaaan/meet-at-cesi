/**
 * Rendering tests mocks
 *
 * useSession is mocked to return a session
 * next/router is mocked to return a router
 */

import { vitest } from "vitest";
import __session__ from "@/tests/mocks/users";

vitest.mock("next-auth/react", () => {
  const originalModule = vitest.importActual("next-auth/react");
  return {
    __esModule: true,
    ...originalModule,
    useSession: vitest.fn(() => {
      return { data: __session__, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

vitest.mock("next/router", () => require("next-router-mock"));
vitest.mock("next/dist/client/router", () => require("next-router-mock"));
