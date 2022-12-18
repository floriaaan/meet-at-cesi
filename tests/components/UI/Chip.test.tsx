import { afterEach, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip } from "@/components/UI/Chip";

afterEach(() => {
  document.body.innerHTML = "";
});

test("chip component with string as child", () => {
  render(<Chip>meet-test</Chip>);
  const chip = screen.getByTestId("chip");

  expect(chip).toBeDefined();
  expect(chip.tagName).toBe("SPAN");
  expect(chip.textContent).toBe("meet-test");
});

test("chip component with react element as child", () => {
  render(
    <Chip>
      <span>meet-test</span>
    </Chip>
  );
  const chip = screen.getByTestId("chip");

  expect(chip).toBeDefined();
  expect(chip.tagName).toBe("SPAN");
  expect(chip.textContent).toBe("meet-test");

  expect(chip.children.length).toBe(1);
  expect(chip.children[0].tagName).toBe("SPAN");
});
