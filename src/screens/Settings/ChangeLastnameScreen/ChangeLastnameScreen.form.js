import * as Yup from "yup";

export function initialValues() {
  return {
    nip: "",
  };
}

export function validationSchema() {
  return Yup.object({
    nip: Yup.string().required(true),
  });
}