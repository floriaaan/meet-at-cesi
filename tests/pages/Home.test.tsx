import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "@/pages/index";
import campusList from "@/resources/campus-list";
import { event } from "@/tests/mocks/events";

test("Home page", () => {
	render(<Home event={event} />);

	const campusListElement = screen.getByTestId("home-campus-list");
	expect(campusListElement).toBeDefined();

	// Check that the campus list is rendered
	const categories = Array.from(
		new Set(campusList.map((campus) => campus.category)),
	);
	expect(campusListElement.children.length).toBe(categories.length);

	// Check that the EventListItem is rendered
	const eventListItemElement = screen.getByTestId("home-event-list-item");
	expect(eventListItemElement).toBeDefined();
});
