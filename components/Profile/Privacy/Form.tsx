import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";

import Select from "@/components/UI/Form/Select";
import toastStyle from "@/resources/toast.config";
import { privacyList } from "@/resources/privacy-list";
import { UserPrivacy } from "@prisma/client";
import { ExtendedUser } from "@/types/User";

const PrivacySchema = Yup.object().shape({
  trophies: Yup.string().oneOf(Object.values(UserPrivacy)),
  participations: Yup.string().oneOf(Object.values(UserPrivacy)),
  createdEvents: Yup.string().oneOf(Object.values(UserPrivacy)),
});

export type PrivacyFormValues = Yup.InferType<typeof PrivacySchema>;
const initialFormValues: PrivacyFormValues = {
  trophies: UserPrivacy.PRIVATE,
  participations: UserPrivacy.PRIVATE,
  createdEvents: UserPrivacy.PRIVATE,
} as unknown as PrivacyFormValues;

type Props = {
  labelClassName?: string;
  initialValues?: PrivacyFormValues;
  onSubmit: (
    values: PrivacyFormValues
  ) => Promise<{ user: ExtendedUser } | false | Error>;
  optionalButton?: JSX.Element;
  submitClassName?: string;
};

export const PrivacyForm = ({
  labelClassName,
  initialValues = initialFormValues,
  onSubmit,
  optionalButton,
  submitClassName,
}: Props) => {
  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (values: PrivacyFormValues) => {
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
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PrivacySchema}
      onSubmit={handleOnSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="grid w-full gap-1 lg:gap-2 lg:grid-cols-2">
          
          <Select
            name="trophies"
            label="Affichage des trophées"
            labelClassName={labelClassName}
            options={privacyList}
            disabled={disabled}
            className="w-full"
          />
          <Select
            name="participations"
            label="Affichage des participations aux événements"
            labelClassName={labelClassName}
            options={privacyList}
            disabled={disabled}
            className="w-full"
          />
          <Select
            name="createdEvents"
            label="Affichage des événements que vous avez créés"
            labelClassName={labelClassName}
            options={privacyList}
            disabled={disabled}
            className="w-full"
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
