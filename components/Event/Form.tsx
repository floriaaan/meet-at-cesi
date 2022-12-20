import type { Event } from "@prisma/client";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/router";

import Input from "@/components/UI/Form/Input";
import Select from "@/components/UI/Form/Select";
import campusList from "@/resources/campus-list";
import audienceList from "@/resources/audience-list";
import toastStyle from "@/resources/toast.config";
import { PlaceSearch } from "@/components/UI/Form/PlaceSearch";

const EventSchema = Yup.object().shape({
	title: Yup.string()
		.trim()
		.required("Tu as oublié le titre, je crois...")
		.min(5, "C'est un peu court, non?"),
	location: Yup.string()
		.trim()
		// .min(20, "Tu es sûr.e que c'est une adresse, c'est court...")
		.required("On va oùuuu ? 🤔"),
	date: Yup.date()
		.min(
			new Date(new Date().setDate(new Date().getDate())),
			"Tu veux vraiment organiser un événement passé ?"
		)
		.required("Je cite: \"C'est quand l'événement ?\" 🤔"),
	audience: Yup.string().required(
		"L'audience est requise. Qui est invité ? 🤔"
	),
	"audience-campus": Yup.string().required(
		"Le campus est requis. C'est où ? 🤔"
	),
});

export type EventFormValues = Yup.InferType<typeof EventSchema>;
const initialFormValues: EventFormValues = {
	title: "",
	location: "",
	date: undefined, //new Date().toISOString().split("T")[0],
	audience: "everyone",
	"audience-campus": "",
} as unknown as EventFormValues;

export const EventForm = ({
	isEditing = false,
	initialValues = initialFormValues,
	onSubmit,
}: {
	isEditing?: boolean;
	initialValues?: EventFormValues;
	onSubmit: (values: EventFormValues) => Promise<Event | false | Error>;
}) => {
	const router = useRouter();
	const [disabled, setDisabled] = useState(false);

	const handleOnSubmit = async (values: EventFormValues) => {
		let toastId: string | undefined;
		try {
			setDisabled(true);
			toastId = toast.loading(
				!isEditing ? "Création en cours..." : "Modification en cours...",
				toastStyle
			);
			// Submit data
			if (typeof onSubmit === "function") {
				onSubmit(values).then((result) => {
					if (result && !(result instanceof Error)) {
						toast.success(
							!isEditing ? "Création réussie 😍" : "Modification réussie 🥸",
							{ id: toastId }
						);
						router.push(`/event/${result.id}`);
					} else
						toast.error(
							!isEditing
								? "Erreur lors de la création 😭"
								: "Erreur lors de la modification 😭",
							{ id: toastId }
						);
				});
			}
			// Redirect user
			//   if (redirectPath) {
			//     router.push(redirectPath);
			//   }
		} catch (e) {
			console.error(e);
			toast.error("Unable to submit", { id: toastId });
			setDisabled(false);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={EventSchema}
			onSubmit={handleOnSubmit}
		>
			{({ isSubmitting, isValid }) => (
				<Form className="flex flex-col w-full gap-y-1">
					<Input
						name="title"
						type="text"
						label="Titre de l'événement"
						placeholder="Soirée Team building 🎉"
						disabled={disabled}
					/>
					<div className="flex flex-col items-center w-full gap-2 md:flex-row">
						<PlaceSearch
							name="location"
							type="text"
							label="Emplacement de l'événement"
							placeholder="Le Malt du Pays - 127 Rue des Martyrs de la Résistance, 76150, Maromme"
							disabled={disabled}
							className="w-full md:w-3/5"
						/>
						<Input
							name="date"
							type="datetime-local"
							label="Date de l'événement"
							disabled={disabled}
							className="w-full md:w-2/5"
						/>
					</div>
					<div className="flex flex-col items-center w-full gap-2 md:flex-row">
						<Select
							name="audience"
							label="Promotion concernée"
							options={audienceList}
							disabled={disabled}
							// multiple
							className="w-full"
						/>
						<Select
							name="audience-campus"
							label="Campus concerné"
							options={[
								{
									value: "",
									label: "Sélectionner un campus",
								},
								...campusList,
							]}
							disabled={disabled}
							className="w-full"
						/>
					</div>

					<div className="flex justify-end mt-4">
						<button
							type="submit"
							//   disabled={disabled || !isValid}
							className="px-6 py-3 font-bold uppercase rounded-full font-body shrink-0 btn__colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting
								? "Envoi en cours..."
								: isEditing
								? "Modifier"
								: "Créer"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
