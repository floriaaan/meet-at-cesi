import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";

import toastStyle from "@/resources/toast.config";
import { useReport } from "@/components/Report/Wrapper";
import Input from "@/components/UI/Form/Input";
import Select from "@/components/UI/Form/Select";
import { ReportType } from "@prisma/client";
import { ReportCreateRequestInput } from "@/lib/fetchers";
import { reportReasonList } from "@/resources/report-list";

const ReportSchema = Yup.object().shape({
  content: Yup.string().required(
    "Il faut bien que tu me dises ce qui ne va pas..."
  ),
  type: Yup.string().required(
    "J'ai besoin de savoir pourquoi tu veux signaler cette ressource."
  ),
});

export type ReportFormValues = Yup.InferType<typeof ReportSchema>;
const initialFormValues: ReportFormValues = {
  content: "",
  type: ReportType.OTHER,
} as unknown as ReportFormValues;

type Props = {
  labelClassName?: string;
  initialValues?: ReportFormValues;
  onSubmit: (values: ReportCreateRequestInput) => Promise<boolean>;
  optionalButton?: JSX.Element;
  submitClassName?: string;
};

export const ReportForm = ({
  labelClassName,
  initialValues = initialFormValues,
  onSubmit,
  submitClassName,
}: Props) => {
  const { object, setIsReportModalOpen: setIsOpen } = useReport();
  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (values: ReportFormValues) => {
    let toastId: string | undefined;
    try {
      setDisabled(true);
      toastId = toast.loading("Envoi en cours...", toastStyle);
      // Submit data
      if (typeof onSubmit === "function") {
        onSubmit({
          ...object,
          ...values,
          type: values.type as ReportType,
        }).then((result) => {
          if (result) {
            toast.success("Signalement bien envoyé, merci ! 🤝", {
              id: toastId,
            });
            setIsOpen(false);
          } else toast.error("Erreur lors de l'envoi 😭", { id: toastId });

          setDisabled(false);
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'envoi.", { id: toastId });
      setDisabled(false);
    }
  };

  return (
    <Formik
      initialValues={(object as unknown as ReportFormValues) || initialValues}
      validationSchema={ReportSchema}
      onSubmit={handleOnSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="flex flex-col w-full mt-2 gap-y-1">
          <Select
            label="Quelle est la raison de ton signalement ?"
            name="type"
            labelClassName={labelClassName}
            disabled={disabled}
            options={[
              {
                label: "-----",
                value: "",
              },
              ...reportReasonList,
            ]}
          />
          <Input
            label="Quel est le problème ?"
            name="content"
            type="textarea"
            labelClassName={labelClassName}
            disabled={disabled}
          />

          <div className="inline-flex justify-end gap-1 mt-2">
            <button
              type="submit"
              disabled={disabled}
              className={
                submitClassName ||
                "border-0 btn-black w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              }
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
