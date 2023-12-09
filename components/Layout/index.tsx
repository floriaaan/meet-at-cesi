import { Navbar } from "@/components/Layout/Navbar";
import { RouterProgressBar } from "@/components/Helpers/RouterProgressBar";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	return (
		<div className="flex flex-col h-auto min-h-[calc(100vh-3rem)] mb-10 md:mb-8 xl:mb-4">
			<div id="navbar-progressBar" className="sticky top-0 z-[41]">
				<Navbar />
				<RouterProgressBar />
			</div>
			<motion.div key={router.route} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
				<main className="h-full grow">{children}</main>
			</motion.div>
		</div>
	);
};
