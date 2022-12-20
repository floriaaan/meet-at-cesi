import { slugify } from "@/lib/slugify";

export const scrapPromotions = () => {
	let list = document.querySelector("ul.list-standard.smaller-font");
	if (!list) throw new Error("No list found");

	let promotions = Array.from(list.children)
		.map(({ firstChild: container }) => {
			let realContainer = container?.parentNode;
			if (!realContainer) throw new Error("No container found");
			const titre = realContainer.querySelector("h2")?.textContent || "";
			// const [_profil, _programme, niveau, domaine, _duree, _campus] =
			// 	realContainer.querySelector("ul").children;
			const liList = realContainer.querySelector("ul")?.children;
			if (!liList) throw new Error("No list of li found");
			return {
				value: slugify(titre),
				label: titre,
				niveau: liList[2]?.textContent?.split(":")[1].trim() || "",
				// @ts-ignore
				domaine: liList[3]?.outerText?.split(":")[1].trim(),
			};
		})
		.sort((a, b) => a.niveau.localeCompare(b.niveau));
	return promotions;
};
