import * as Yup from "yup";
import { useRef, useState } from "react";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";

import Input from "@/components/UI/Form/Input";
import { ExtendedComment } from "@/types/Event";
import toastStyle from "@/resources/toast.config";
import classNames from "classnames";

const CommentSchema = Yup.object().shape({
  content: Yup.string().trim().required("Tu voulais dire quoi ?"),
});

export type CommentFormValues = Yup.InferType<typeof CommentSchema>;
const initialFormValues: CommentFormValues = {
  content: "",
} as unknown as CommentFormValues;

type SetFieldValue = (
  field: string,
  value: any,
  shouldValidate?: boolean | undefined
) => void;

export const CommentForm = ({
  isEditing = false,
  isReplying = false,
  initialValues = initialFormValues,
  onSubmit,
}: {
  isEditing?: boolean;
  isReplying?: boolean;
  initialValues?: CommentFormValues;
  onSubmit: (
    values: CommentFormValues
  ) => Promise<ExtendedComment[] | false | Error>;
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleOnSubmit = async (
    values: CommentFormValues,
    setFieldValue: SetFieldValue
  ) => {
    let toastId: string | undefined;
    try {
      setDisabled(true);
      toastId = toast.loading(
        !isEditing ? "Envoi en cours..." : "Modification en cours...",
        toastStyle
      );
      // Submit data
      if (typeof onSubmit === "function") {
        onSubmit(values).then((result) => {
          if (result && !(result instanceof Error)) {
            toast.success(
              !isEditing ? "Commentaire ajouté 😎" : "Modification réussie 🥸",
              { id: toastId }
            );
            setFieldValue("content", "", false);
          } else
            toast.error(
              !isEditing
                ? "Erreur lors de la création 😭"
                : "Erreur lors de la modification 😭",
              { id: toastId }
            );

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
      validationSchema={CommentSchema}
      onSubmit={(values, { setFieldValue }) => {
        handleOnSubmit(values, setFieldValue);
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="inline-flex items-center w-full gap-x-1">
          <Input
            name="content"
            type="text"
            label=""
            placeholder={
              isReplying
                ? `"Je suis d'accord avec toi, vivement le prochain !"`
                : `"Trop bien cet événement, j'attends la prochaine édition avec impatience !"`
            }
            disabled={disabled}
            className="grow"
            inputExtraClassName={
              isReplying ? "py-[0.25rem] lg:py-[0.25rem]" : undefined
            }
            errorClassName="hidden"
            autoComplete="off"
            id="comment-input"
          />

          <button
            type="submit"
            disabled={disabled || !isValid}
            className={
              isReplying
                ? "py-1 border-b btn-black shrink-0 w-fit"
                : "py-1.5 lg:py-3 border-b btn-black shrink-0 w-fit"
            }
          >
            {isSubmitting
              ? "Envoi en cours..."
              : isReplying
              ? "Répondre"
              : isEditing
              ? "Modifier"
              : "Envoyer"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
