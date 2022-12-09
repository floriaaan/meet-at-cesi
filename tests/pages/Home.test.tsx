import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Home from "@/pages/index";
import campusList from "@/resources/campus-list";



test("Home page", () => {
  const caption = "Hello from E2E Tests";
  render(<Home caption={caption} />);

  const main = within(screen.getByRole("main"));
  expect(main.getByRole("heading", { name: caption })).toBeDefined();

  const campusListElement = main.getByTestId("home-campus-list");
  expect(campusListElement).toBeDefined();
  expect(campusListElement.children.length).toBe(campusList.length);
});
