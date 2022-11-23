import * as Yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import { useState } from "react";

import toastStyle from "@/resources/toast.config";
import Input from "@/components/UI/Form/Input";
import { useFeedback } from "@/components/Helpers/Feedback";
import Select from "@/components/UI/Form/Select";
import routes from "@/resources/routes";

const FeedbackSchema = Yup.object().shape({
  text: Yup.string().required(
    "Je sens bien que vous essayez de me dire quelque chose..."
  ),
  page: Yup.string().required("Où étais-tu ?"),
  history_share: Yup.boolean(),
});

export type FeedbackFormValues = Yup.InferType<typeof FeedbackSchema>;
const initialFormValues: FeedbackFormValues = {
  text: "",
  page: "/",
  history_share: true,
} as unknown as FeedbackFormValues;

type Props = {
  labelClassName?: string;
  initialValues?: FeedbackFormValues;
  onSubmit: (values: FeedbackFormValues) => Promise<boolean>;
  optionalButton?: JSX.Element;
  submitClassName?: string;
};

export const FeedbackForm = ({
  labelClassName,
  initialValues = initialFormValues,
  onSubmit,
  submitClassName,
}: Props) => {
  const { history, setIsFeedbackOpen } = useFeedback();
  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (values: FeedbackFormValues) => {
    let toastId: string | undefined;
    try {
      setDisabled(true);
      toastId = toast.loading("Modification en cours...", toastStyle);
      // Submit data
      if (typeof onSubmit === "function") {
        onSubmit(values).then((result) => {
          if (result) {
            toast.success("Feedback bien envoyé, merci ! 🤝", { id: toastId });
            setIsFeedbackOpen(false);
          } else toast.error("Erreur lors de l'envoi 😭", { id: toastId });

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
      validationSchema={FeedbackSchema}
      onSubmit={handleOnSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="flex flex-col w-full mt-2 gap-y-1">
          <Select
            label="Page"
            name="page"
            labelClassName={labelClassName}
            disabled={disabled}
            options={history
              // remove duplicates
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((h: string) => ({
                value: h,
                label: routes[h as keyof typeof routes],
              }))}
          />
          <Input
            label="Texte"
            name="text"
            type="textarea"
            labelClassName={labelClassName}
            disabled={disabled}
            rows={5}
          />
          <Input
            label={`Partager mon historique de navigation (${process.env.NEXT_PUBLIC_APP_NAME})`}
            name="history_share"
            type="checkbox"
            labelClassName={labelClassName}
            inputClassName="w-4 h-4 accent-primary"
            disabled={disabled}
          />
          <div className="flex flex-col justify-end gap-1 mt-2">
            <button
              type="submit"
              disabled={disabled}
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