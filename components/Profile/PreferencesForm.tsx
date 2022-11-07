import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";

import Select from "@/components/UI/Form/Select";
import campusList from "@/resources/campus-list";
import audienceList, { yearsList } from "@/resources/audience-list";
import toastStyle from "@/resources/toast.config";
import { ExtendedUser } from "@/types/User";

const PreferencesSchema = Yup.object().shape({
  promotion: Yup.string(),
  campus: Yup.string(),
  promotionYear: Yup.string(),
});

export type PreferencesFormValues = Yup.InferType<typeof PreferencesSchema>;
const initialFormValues: PreferencesFormValues = {
  promotion: "",
  promotionYear: "",
  campus: "",
} as unknown as PreferencesFormValues;

const DEFAULT_SELECT = {
  value: "",
  label: "------",
};

export const PreferencesForm = ({
  initialValues = initialFormValues,
  onSubmit,
}: {
  initialValues?: PreferencesFormValues;
  onSubmit: ({}: PreferencesFormValues) => Promise<
    { user: ExtendedUser } | false
  >;
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
          <div className="flex flex-col w-full gap-2 lg:flex-row">
            <Select
              name="promotion"
              label="Ma promotion"
              options={[DEFAULT_SELECT, ...audienceList]}
              disabled={disabled}
              className="w-full lg:w-3/4"
            />
            <Select
              name="promotionYear"
              label="Année"
              options={[DEFAULT_SELECT, ...yearsList]}
              disabled={disabled}
              className="w-full lg:w-1/4"
            />
          </div>
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

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              //   disabled={disabled || !isValid}
              className="border-0 btn-black w-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Envoi en cours..." : "Modifier"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
