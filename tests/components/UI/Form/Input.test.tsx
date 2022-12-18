import { afterEach, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import Input from "@/components/UI/Form/Input";
import { FormWrapper } from "@/tests/components/UI/Form/BasicFormWrapper";

// afterEach(() => {
//   document.body.innerHTML = "";
// });

test("input[type=text] component", () => {
  render(
    <FormWrapper>
      <Input label="Input test" name="text" type="text"></Input>
    </FormWrapper>
  );

  const input = screen.getByLabelText("Input test");
  expect(input).toBeDefined();
  expect(input.tagName).toBe("INPUT");

  expect(input.getAttribute("type")).toBe("text");
  expect(input.getAttribute("name")).toBe("text");

  // error handling
  // set incorrect value
  fireEvent.change(input, { target: { value: "error" } });
  expect(input.getAttribute("value")).toBe("error");

  // submit form
  const submit = screen.getByTestId("form-submit");
  fireEvent.click(submit);

  const error = screen.queryByTestId("input-error");
  expect(error).toBeDefined();
});
