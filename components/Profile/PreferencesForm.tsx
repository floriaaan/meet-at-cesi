import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";

import Select from "@/components/UI/Form/Select";
import campusList from "@/resources/campus-list";
import audienceList, { yearsList } from "@/resources/audience-list";
import toastStyle from "@/resources/toast.config";
import { ExtendedUser } from "@/types/User";
import { useCookies } from "react-cookie";

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

type Props = {
  labelClassName?: string;
  initialValues?: PreferencesFormValues;
  onSubmit: ({}: PreferencesFormValues) => Promise<
    { user: ExtendedUser } | false
  >;
  optionalButton?: JSX.Element;
  submitClassName?: string;
};

export const PreferencesForm = ({
  labelClassName,
  initialValues = initialFormValues,
  onSubmit,
  optionalButton,
  submitClassName,
}: Props) => {
  const [, setCookie] = useCookies([
    "meet-preferences",
    "meet-preferences_dismissed",
  ]);
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
            if (result.user.preferences) {
              toast.success("Modification réussie 🥸", { id: toastId });
              setCookie("meet-preferences", result.user.preferences, {
                path: "/",
                maxAge: 60 * 60 * 24 * 365,
              });
              setCookie("meet-preferences_dismissed", "true", { path: "/" });
            } else {
              toast.success("Suppression réussie 🥸", { id: toastId });
              setCookie("meet-preferences", undefined, { path: "/" });
              setCookie("meet-preferences_dismissed", "false", { path: "/" });
            }
          } else
            toast.error("Erreur lors de la modification 😭", { id: toastId });

          setDisabled(false);
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
              labelClassName={labelClassName}
              options={[
                DEFAULT_SELECT,
                ...audienceList.filter((a) => a.value !== "everyone"),
              ]}
              disabled={disabled}
              className="w-full lg:w-3/4"
              canHaveError={false}
            />
            <Select
              name="promotionYear"
              label="Année"
              labelClassName={labelClassName}
              options={[DEFAULT_SELECT, ...yearsList]}
              disabled={disabled}
              className="w-full lg:w-1/4"
              canHaveError={false}
            />
          </div>
          <Select
            name="campus"
            label="Mon campus"
            labelClassName={labelClassName}
            options={[
              {
                value: "",
                label: "Sélectionner un campus",
              },
              ...campusList,
            ]}
            disabled={disabled}
            className="w-full"
            canHaveError={false}
          />

          <div className="flex flex-col justify-end gap-1 mt-2">
            {optionalButton}
            <button
              type="submit"
              //   disabled={disabled || !isValid}
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
