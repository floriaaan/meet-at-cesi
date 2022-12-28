import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";

import toastStyle from "@/resources/toast.config";
import { ExtendedUser } from "@/types/User";

const NotificationsSchema = Yup.object().shape({});

export type NotificationsFormValues = Yup.InferType<typeof NotificationsSchema>;
const initialFormValues: NotificationsFormValues =
	{} as unknown as NotificationsFormValues;

type Props = {
	labelClassName?: string;
	initialValues?: NotificationsFormValues;
	onSubmit: (
		values: NotificationsFormValues,
	) => Promise<{ user: ExtendedUser } | false | Error>;
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
