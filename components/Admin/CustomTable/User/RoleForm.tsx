import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Role, User } from "@prisma/client";

import Select from "@/components/UI/Form/Select";
import toastStyle from "@/resources/toast.config";
import { roleList } from "@/resources/role-list";
import { log } from "@/lib/log";

const RoleSchema = Yup.object().shape({
	role: Yup.string().oneOf([Role.USER, Role.ADMIN, Role.MODERATOR]).required(),
});

export type RoleFormValues = Yup.InferType<typeof RoleSchema>;

type RoleFormProps = {
	initialValues: RoleFormValues;
	// eslint-disable-next-line no-unused-vars
	onSubmit: (values: RoleFormValues) => Promise<{ user: User } | Error>;
	closeModal: () => void;
};

export const RoleForm = ({
	onSubmit,
	initialValues,
	closeModal,
}: RoleFormProps) => {
	const [disabled, setDisabled] = useState(false);

	async function handleOnSubmit(values: RoleFormValues) {
		let toastId: string | undefined;
		try {
			setDisabled(true);
			toastId = toast.loading("Modification en cours...", toastStyle);
			if (typeof onSubmit === "function") {
				onSubmit(values).then((result) => {
					if (result && !(result instanceof Error)) {
						toast.success("Modification réussie 🥸", { id: toastId });
						closeModal();
					} else {
						toast.error(`Erreur lors de la modification 😭\n${result}`, {
							id: toastId,
						});
					}
					setDisabled(false);
				});
			}
		} catch (e) {
			log.error(e);
			toast.error("Unable to submit", { id: toastId });
			setDisabled(false);
		}
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={RoleSchema}
			onSubmit={handleOnSubmit}
		>
			{({ isSubmitting, isValid }) => (
				<Form className="flex flex-col w-full gap-y-1">
					<Select
						name="role"
						label="Rôle de l'utilisateur"
						disabled={disabled}
						options={roleList}
					/>
					<div className="flex justify-end mt-4">
						<button
							type="submit"
							disabled={disabled || !isValid}
							className="px-6 py-3 font-bold uppercase rounded-full font-body shrink-0 btn__colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Envoi en cours..." : "Modifier"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
