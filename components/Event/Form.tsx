import type { Event } from "@prisma/client";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/router";

import toastStyle from "@/resources/toast.config";
import { Select, Input } from "@/components/UI/Form";
import { campusList } from "@/resources/campus-list";
import { audienceList } from "@/resources/audience-list";
import { PlaceSearch } from "@/components/UI/Form/PlaceSearch";
import { log } from "@/lib/log";
import Link from "next/link";
import { CGU_LAST_UPDATE } from "@/pages/legal";

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
			"Tu veux vraiment organiser un événement passé ?",
		)
		.required("Je cite: \"C'est quand l'événement ?\" 🤔"),
	audience: Yup.string().required(
		"L'audience est requise. Qui est invité ? 🤔",
	),
	audienceCampus: Yup.string().required("Le campus est requis. C'est où ? 🤔"),
	private: Yup.boolean(),

	cgu: Yup.boolean()
		.oneOf(
			[true],
			"Tu dois accepter les CGU pour continuer, je sais que c'est long à lire mais c'est obligatoire 🙏",
		)
		.required(),
});

export type EventFormValues = Yup.InferType<typeof EventSchema>;
const initialFormValues: EventFormValues = {
	title: "",
	location: "",
	date: undefined, //new Date().toISOString().split("T")[0],
	audience: "everyone",
	audienceCampus: "",
	private: false,
	cgu: false,
} as unknown as EventFormValues;

export const EventForm = ({
	isEditing = false,
	initialValues = initialFormValues,
	onSubmit,
}: {
	isEditing?: boolean;
	initialValues?: EventFormValues;
	onSubmit: (values: EventFormValues) => Promise<Event | Error | false>;
}) => {
	const { push } = useRouter();
	const [disabled, setDisabled] = useState(false);

	const handleOnSubmit = async (values: EventFormValues) => {
		let toastId: string | undefined;
		try {
			setDisabled(true);
			toastId = toast.loading(
				!isEditing ? "Création en cours..." : "Modification en cours...",
				toastStyle,
			);
			// Submit data
			if (typeof onSubmit === "function") {
				onSubmit(values).then((result) => {
					if (result && !(result instanceof Error)) {
						toast.success(
							!isEditing ? "Création réussie 😍" : "Modification réussie 🥸",
							{ id: toastId },
						);
						push(`/event/${result.id}`);
					} else
						toast.error(
							!isEditing
								? "Erreur lors de la création 😭"
								: "Erreur lors de la modification 😭",
							{ id: toastId },
						);
					setDisabled(false);
				});
			}
		} catch (e) {
			log.error(e);
			toast.error("Unable to submit", { id: toastId });
			setDisabled(false);
		}
	};
	return (
		<Formik
			initialValues={
				(!isEditing
					? initialValues
					: { ...initialValues, cgu: true }) as EventFormValues
			}
			validationSchema={EventSchema}
			onSubmit={handleOnSubmit}
		>
			{({ isSubmitting, isValid: _isValid }) => (
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
							options={[
								{ label: "------", value: "", niveau: "Par défaut" },
								...audienceList,
							]}
							disabled={disabled}
							className="w-full"
							groupBy="niveau"
						/>
						<Select
							name="audienceCampus"
							label="Campus concerné"
							options={[
								{
									value: "------",
									label: "Sélectionner un campus",
								},
								...campusList,
							]}
							disabled={disabled}
							className="w-full"
						/>
					</div>

					<Input
						name="private"
						type="checkbox"
						label="Événement privé"
						disabled={disabled}
						inputExtraClassName="accent-primary"
					/>
					<p className="text-xs">
						Un événement privé ne sera visible uniquement par ses participants
						ainsi que les personnes invités à ce dernier.
					</p>

					<hr className="my-4" />
					<p className="text-xs">
						<Link href="/legal" className="underline" target="_blank">
							{"Conditions générales d'utilisation"}
						</Link>{" "}
						- dernière mise à jour le {CGU_LAST_UPDATE.date}
					</p>
					<Input
						name="cgu"
						type="checkbox"
						label="J'ai lu et j'accepte les conditions générales d'utilisation"
						disabled={disabled}
						inputExtraClassName="accent-primary"
					/>

					<div className="flex justify-end mt-4">
						<button
							type="submit"
							disabled={disabled}
							// disabled={disabled || !isValid} // isValid is not UX friendly
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
