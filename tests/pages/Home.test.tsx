import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "@/pages/index";
import campusList from "@/resources/campus-list";

test("Home page", () => {
	render(<Home caption={"Caption"} />);

	// Check that the campus list is rendered
	const campusListElement = screen.getByTestId("home-campus-list");
	expect(campusListElement).toBeDefined();

	expect(campusListElement.children.length).toBe(campusList.length);

	// Check that the caption is rendered
	const captionElement = screen.getByTestId("home-caption");
	expect(captionElement).toBeDefined();
	expect(captionElement.textContent).toBe("Caption");
});
