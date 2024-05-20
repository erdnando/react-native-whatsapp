import * as Yup from "yup";

export function initialValues() {
  return {
    name: "",
    llave: "",
    image: "",
  };
}



export function validationSchema() {
  return Yup.object({
    name: Yup.string().required(true),
   // image: Yup.object().required(true),
  });
}

export function validationSchemaLlave() {
  return Yup.object({
    name: Yup.string().required(true),
    llave: Yup.string().required(true),
  });
}