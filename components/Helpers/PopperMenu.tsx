import { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu } from "@headlessui/react";

import { usePopper } from "@/hooks/usePopper";

type PopperMenuProps = {
	// eslint-disable-next-line no-unused-vars
	children: ({ open }: { open: boolean }) => ReactNode;
	// eslint-disable-next-line no-unused-vars
	buttonChildren: ({ open }: { open: boolean }) => ReactNode;
	popperOptions?: Parameters<typeof usePopper>[0];
};

export default function PopperMenu({
	children,
	buttonChildren,
	popperOptions,
}: PopperMenuProps) {
	const [trigger, container] = usePopper({
		placement: popperOptions?.placement || "bottom-end",
		strategy: popperOptions?.strategy || "fixed",
		modifiers: popperOptions?.modifiers || [
			{ name: "offset", options: { offset: [0, 10] } },
		],
	});

	return (
		<Menu>
			{({ open }) => (
				<>
					<Menu.Button className="flex items-center focus:outline-none" ref={trigger}>
						{buttonChildren({ open })}
					</Menu.Button>

					<Portal>
						<Menu.Items className="z-[42] focus:outline-none w-full md:w-auto" ref={container}>
							{children({ open })}
						</Menu.Items>
					</Portal>
				</>
			)}
		</Menu>
	);
}

function Portal(props: { children: ReactNode }) {
	const { children } = props;
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;
	return createPortal(children, document.body);
}
