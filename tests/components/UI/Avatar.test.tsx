import { afterEach, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  Avatar,
  AvatarList,
  Name,
  AvatarWithName,
} from "@/components/UI/Avatar";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/Session";
import { administrator, unverifiedUser } from "@/tests/mocks/users";
import { getInitials } from "@/lib/string";

afterEach(() => {
  document.body.innerHTML = "";
});

/**
 *  ! user in session has no image
 *  ! user in session is verified
 */

test("only avatar without link from user in session", () => {
  const { data: session } = useSession();
  const { user } = (session as ExtendedSession) || {};

  render(<Avatar className="w-8 h-8" user={user} link={false} />);
  const avatar = screen.getByTestId("avatar");

  expect(avatar).toBeDefined();
  expect(avatar.tagName).toBe("SPAN");
  expect(avatar.textContent).toBe("JB");
  expect(avatar.className).toContain("bg-primary");
  expect(avatar.className).toContain("rounded-full");
  expect(avatar.className).toContain("w-8 h-8");
});

// ! disabled because of next/link bug
// test("only avatar with link from user in session", () => {
//   const { data: session } = useSession();
//   const { user } = (session as ExtendedSession) || {};

//   render(<Avatar className="w-8 h-8" user={user} link />);
//   const avatar = screen.getByTestId("avatar");

//   expect(avatar.parentElement).toBeDefined();
//   // expect(avatar.parentElement?.tagName).toBe("A");
// });

test("only name from user in session", () => {
  const { data: session } = useSession();
  const { user } = (session as ExtendedSession) || {};

  render(<Name user={user} />);
  const name = screen.getByTestId("avatar-name");

  expect(name).toBeDefined();

  const span = name.querySelector("span");

  expect(span).toBeDefined();
  expect(span?.textContent).toBe(user.name);

  const icon = name.querySelector("svg");
  expect(icon).toBeDefined();
});

test("avatar with name from user in session", () => {
  const { data: session } = useSession();
  const { user } = (session as ExtendedSession) || {};

  render(<AvatarWithName user={user} direction="row" />);
  const avatarWithName = screen.getByTestId("avatar-with-name");

  expect(avatarWithName).toBeDefined();

  const avatar = avatarWithName.querySelector("span");
  expect(avatar).toBeDefined();
  expect(avatar?.textContent).toBe("JB");

  const name = avatarWithName.querySelector("[data-testid='avatar-name']");
  expect(name).toBeDefined();
  expect(name?.textContent).toBe(user.name);

  const icon = name?.querySelector("svg");
  expect(icon).toBeDefined();
});

test("avatar list", () => {
  const { data: session } = useSession();
  const { user } = (session as ExtendedSession) || {};

  const list = [user, unverifiedUser, administrator];

  render(<AvatarList users={list} avatarClassName="w-8 h-8" />);
  const avatarList = screen.getByTestId("avatar-list");

  expect(avatarList).toBeDefined();
  expect(avatarList.children.length).toBe(list.length);

  const avatars = avatarList.querySelectorAll("[data-testid='avatar']");
  expect(avatars.length).toBe(list.length);

  list.map((user, index) => {
    expect(avatars[index].textContent).toBe(getInitials(user.name as string));
  });
});
