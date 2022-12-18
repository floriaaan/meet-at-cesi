import { Formik } from "formik";
import { ReactNode } from "react";
import { Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
  text: Yup.string().notOneOf(["error"]).required("Required"),
  textarea: Yup.string().required("Required"),
  number: Yup.number().required("Required"),
});
export const FormWrapper = ({ children }: { children: ReactNode }) => (
  <Formik
    onSubmit={() => {}}
    validationSchema={validationSchema}
    initialValues={{
      email: "",
      password: "",
      text: "",
      textarea: "",
      number: "",
    }}
  >
    <Form>
      {children}
      <button data-testid="form-submit" type="submit">
        Submit
      </button>
    </Form>
  </Formik>
);
