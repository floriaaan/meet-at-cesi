import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";

import toastStyle from "@/resources/toast.config";
import Input from "@/components/UI/Form/Input";
import { NotificationSettings } from "@prisma/client";

const NotificationsSchema = Yup.object().shape({
	EVENT_INVITATION: Yup.boolean(),
	EVENT_PARTICIPATION: Yup.boolean(),
	EVENT_CREATION: Yup.boolean(),
	EVENT_MODIFICATION: Yup.boolean(),
	EVENT_DELETION: Yup.boolean(),
	COMMENT_CREATION: Yup.boolean(),
	REPORT_ACCEPTED: Yup.boolean(),
	REPORT_REFUSED: Yup.boolean(),
	FEEDBACK_RESPONSE: Yup.boolean(),
});

export type NotificationsFormValues = Yup.InferType<typeof NotificationsSchema>;
const initialFormValues: NotificationsFormValues = {
	EVENT_INVITATION: true,
	EVENT_PARTICIPATION: false,
	EVENT_CREATION: false,
	EVENT_MODIFICATION: false,
	EVENT_DELETION: false,
	COMMENT_CREATION: false,
	REPORT_ACCEPTED: false,
	REPORT_REFUSED: false,
	FEEDBACK_RESPONSE: false,
} as unknown as NotificationsFormValues;

type Props = {
	labelClassName?: string;
	initialValues?: NotificationsFormValues;
	onSubmit: (
		values: NotificationsFormValues,
	) => Promise<NotificationSettings | false | Error>;
	optionalButton?: JSX.Element;
	submitClassName?: string;
};

export const NotificationsForm = ({
	initialValues = initialFormValues,
	onSubmit,
	submitClassName,
}: Props) => {
	const [disabled, setDisabled] = useState(false);

	async function handleOnSubmit(values: NotificationsFormValues) {
		let toastId: string | undefined;
		try {
			setDisabled(true);
			toastId = toast.loading("Modification en cours...", toastStyle);
			// Submit data
			if (typeof onSubmit === "function") {
				onSubmit(values).then((result) => {
					if (result && !(result instanceof Error)) {
						toast.success("Modification réussie 🥸", { id: toastId });
					} else
						toast.error("Erreur lors de la modification 😭", { id: toastId });

					setDisabled(false);
				});
			}
		} catch (e) {
			console.error(e);
			toast.error("Unable to submit", { id: toastId });
			setDisabled(false);
		}
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={NotificationsSchema}
			onSubmit={handleOnSubmit}
		>
			{({ isSubmitting, isValid }) => (
				<Form className="grid w-full gap-1 lg:gap-2 lg:grid-cols-2">
					<Input
						type="checkbox"
						label="Invitation à un événement"
						name="EVENT_INVITATION"
					/>
					<Input
						type="checkbox"
						label="Participation à un événement"
						name="EVENT_PARTICIPATION"
					/>
					<Input
						type="checkbox"
						label="Création d'un événement"
						name="EVENT_CREATION"
					/>
					<Input
						type="checkbox"
						label="Modification d'un événement"
						name="EVENT_MODIFICATION"
					/>
					<Input
						type="checkbox"
						label="Suppression d'un événement"
						name="EVENT_DELETION"
					/>
					<Input
						type="checkbox"
						label="Création d'un commentaire"
						name="COMMENT_CREATION"
					/>
					<Input
						type="checkbox"
						label="Signalement accepté"
						name="REPORT_ACCEPTED"
					/>
					<Input
						type="checkbox"
						label="Signalement refusé"
						name="REPORT_REFUSED"
					/>
					<Input
						type="checkbox"
						label="Réponse à un feedback"
						name="FEEDBACK_RESPONSE"
					/>
					<div className="flex flex-col justify-end gap-1 mt-2 lg:col-span-2">
						<button
							type="submit"
							disabled={disabled || !isValid}
							className={
								submitClassName ||
								"border-0 btn-black w-fit disabled:opacity-50 disabled:cursor-not-allowed"
							}
						>
							{isSubmitting ? "Envoi en cours..." : "Modifier"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
