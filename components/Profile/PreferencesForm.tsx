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

const PreferencesSchema = Yup.object().shape({
  promotion: Yup.string(),
  campus: Yup.string(),
});

export type PreferencesFormValues = Yup.InferType<typeof PreferencesSchema>;
const initialFormValues: PreferencesFormValues = {
  promotion: "",
  campus: "",
} as unknown as PreferencesFormValues;

export const PreferencesForm = ({
  initialValues = initialFormValues,
  onSubmit,
}: {
  initialValues?: PreferencesFormValues;
  onSubmit: ({}: PreferencesFormValues) => Promise<boolean | Error>;
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (values: PreferencesFormValues) => {
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
      validationSchema={PreferencesSchema}
      onSubmit={handleOnSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="flex flex-col w-full gap-y-1">
          <Select
            name="promotion"
            label="Ma promotion"
            options={audienceList}
            disabled={disabled}
            className="w-full"
          />
          <Select
            name="campus"
            label="Mon campus"
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

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              //   disabled={disabled || !isValid}
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
