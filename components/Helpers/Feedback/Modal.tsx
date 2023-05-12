import { signIn, useSession } from "next-auth/react";

import { useFeedback } from "@/components/Helpers/Feedback";
import { createFeedback } from "@/lib/fetchers";
import { FeedbackForm } from "@/components/Helpers/Feedback/Form";
import { Modal } from "@/components/UI/Modal";
import nProgress from "nprogress";

export const FeedbackModal = () => {
	const isAuthenticated = useSession().status === "authenticated";
	const { isFeedbackOpen, setIsFeedbackOpen, history } = useFeedback();
	const closeModal = () => setIsFeedbackOpen(false);

	return (
		<Modal
			title="Feedback"
			subtitle={
				isAuthenticated ? (
					<>
						<div className="flex flex-col text-xs xs:gap-2 xs:flex-row xs:items-center ">
							<span>{'" C\'est cassé 😣 "'}</span>
							<span className="hidden xs:block">{"—"}</span>
							<span>{'" Il manquerait ça pour que ça soit parfait 🥰 "'}</span>
						</div>
						<p className="mt-1.5 text-sm font-bold">Dîtes nous tout !</p>
					</>
				) : (
					<>
						<p className="text-xs">
							{"Vous pourrez nous faire un retour sur l'application."}
						</p>
						<p className="mt-1.5 text-sm font-bold">
							Connectez-vous pour nous faire un retour !
						</p>
					</>
				)
			}
			isOpen={isFeedbackOpen}
			onClose={closeModal}
		>
			{isAuthenticated ? (
				<FeedbackForm
					onSubmit={(values) => {
						return createFeedback({
							...values,
							history: values.history_share ? history : [],
						});
					}}
					submitClassName="w-full btn-black text-sm border-b"
					labelClassName="text-xs font-bold font-black"
				/>
			) : (
				<div>
					<hr className="my-4" />
					<div className="inline-flex justify-end w-full">
						<button
							className="border-0 btn-black"
							onClick={async () => {
								// trigger progress bar linked to sign in method
								nProgress.start();

								await signIn("azure-ad", {
									redirect: false,
								}).then(() => {
									nProgress.done();
								});
							}}
						>
							Se connecter
						</button>
					</div>
				</div>
			)}
		</Modal>
	);
};
