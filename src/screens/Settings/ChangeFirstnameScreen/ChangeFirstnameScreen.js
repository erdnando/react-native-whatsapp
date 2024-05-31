import { View, Text } from "react-native";
import { Input, Button, useToast, Box } from "native-base";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { User } from "../../../api";
import { useAuth } from "../../../hooks";
import { initialValues, validationSchema } from "./ChangeFirstnameScreen.form";
import { styles } from "./ChangeFirstnameScreen.styles";

const userController = new User();

export function ChangeFirstnameScreen() {
  const navigation = useNavigation();
  const { accessToken, updateUser } = useAuth();
  const toast = useToast();


 // onTextChanged(value) {
    // code to remove non-numeric characters from text
   // this.setState({ number: value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '') });
   // formik.setFieldValue("firstname", value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '') })
   //formik.setFieldValue("firstname", text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ''))
  //}
  
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      //applying new alias
      //TODO: validate strange characters, just letters and numbers are valid





      //TODO: validate whether it exists or not.
      const aliasResponse = await userController.validateAlias(accessToken, formValue.firstname.toLowerCase());
      console.log(aliasResponse)
      if(aliasResponse.length>0){
            console.log("El alias ya existe, favor de utilizar otro....")

            toast.show({
              placement: "top",
              render: () => {
                return <Box bg="#ff5733" px="4" py="3" rounded="md" mb={8} style={{borderTopColor:'white', borderTopWidth:3,color:'white', zIndex:3000 }}>
                      <Text style={{color:'white'}}>Lo sentimos, este alias ya ha sido utilizado. favor deutilizar otro 😓 </Text>
                      </Box>;
              }
            });

      }else{

        try {
          const dataUser = { firstname: formValue.firstname.toLowerCase() };//,email: formValue.firstname
          await userController.updateUser(accessToken, dataUser);
          updateUser("firstname", formValue.firstname.toLowerCase() );
          navigation.goBack();
        } catch (error) {
          console.error(error);
        }
      }
     
    },
  });

  return (
    <View style={styles.content}>
      <Input
        placeholder="Alias"
        variant="unstyled"
        maxLength={30}
        autoFocus
        value={formik.values.firstname}
        onChangeText={(text) => formik.setFieldValue("firstname", text.replace(/[- #*+=():"'?!$&@^%;,.<>\{\}\[\]\\\/]/gi, ''))}
        style={[styles.input, formik.errors.firstname && styles.inputError]}
      />
      <Button
        style={styles.btn}
        onPress={formik.handleSubmit}
        isLoading={formik.isLoading}
      >
        Aplicar
      </Button>
    </View>
  );
}