import * as Yup from "yup";

export function initialValues(name, llave) {
  return {
    name,
    llave
  };
}

export function validationSchema() {
  return Yup.object({
    name: Yup.string().required(true),
  });
}