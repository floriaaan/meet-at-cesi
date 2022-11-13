import Input from "@/components/UI/Form/Input";
import { PlaceSearch } from "@/components/UI/Form/PlaceSearch";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";

export default function Test() {
  return (
    <Formik
      initialValues={{ location: "" }}
      onSubmit={function (
        values: FormikValues,
        formikHelpers: FormikHelpers<FormikValues>
      ): void | Promise<any> {
        throw new Error("Function not implemented.");
      }}
    >
      <Form className="max-w-sm p-4 mx-auto">
        <PlaceSearch type="text" label="Emplacement" name="location" />
        <Input type="text" label="test" name="test" />
      </Form>
    </Formik>
  );
}
