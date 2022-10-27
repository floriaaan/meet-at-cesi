import * as Yup from "yup";
import { Form, Formik } from "formik";
import Input from "../UI/Input";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Select from "../UI/Select";
import { campusList } from "../../resources/campus-list";

const EventSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Tu as oublié le titre, je crois...")
    .min(5, "C'est un peu court, non?"),
  //   description: Yup.string().trim().required("Required"),
  location: Yup.string()
    .trim()
    .min(20, "Tu es sûr.e que c'est une adresse, c'est court...")
    .required("On va oùuuu ? 🤔"),
  date: Yup.date()
    .min(new Date(), "Tu veux vraiment organiser un évenement passé ?")
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
  onSubmit,
}: {
  onSubmit: ({}: EventFormValues) => Promise<any>;
}) => {
  //   const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (values: EventFormValues) => {
    let toastId: string | undefined;
    try {
      setDisabled(true);
      toastId = toast.loading("Création en cours...", {
        style: {
          borderRadius: 0,
          boxShadow: "none",
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: 1,
          fontFamily: "inherit",
        },
        iconTheme: {
          primary: "#fbe216",
          secondary: "#000",
        },
      });
      // Submit data
      if (typeof onSubmit === "function") {
        onSubmit(values).then((success) => {
          if (success) toast.success("Création réussie 😍", { id: toastId });
          else toast.error("Erreur lors de la création 😭", { id: toastId });
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
      initialValues={initialFormValues}
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
            <Input
              name="location"
              type="text"
              label="Emplacement de l'événement"
              placeholder="Le Malt du Pays - 127 Rue des Martyrs de la Résistance, 76150, Maromme"
              disabled={disabled}
              className="w-full md:w-3/5"
            />
            <Input
              name="date"
              type="date"
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
                { value: "everyone", label: "Tout le monde" },
                { value: "2020", label: "2020" },
              ]}
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
              {isSubmitting ? "Envoi en cours..." : "Créer"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
