import { View } from "react-native";
import { Input, Button,Pressable,Icon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { User } from "../../../api";
import { useAuth } from "../../../hooks";
import { initialValues, validationSchema } from "./ChangeLastnameScreen.form";
import { styles } from "./ChangeLastnameScreen.styles";
import { MD5method } from "../../../utils";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const userController = new User();

export function ChangeLastnameScreen() {
  const navigation = useNavigation();
  const { accessToken, updateUser, email } = useAuth();
  const [show, setShow] = useState(false);


  const handleClick = () => setShow((prevState) => !prevState);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        console.log("set nip:::::");
        console.log(formValue);
        await userController.updateUserNipDB(email, formValue);

        //refesh on authcontext nip values
        updateUser("nip", MD5method(formValue.nip));
        updateUser("nipraw", formValue.nip);
        
        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <View style={styles.content}>
      <Input
      type= {show ? "text" : "password"}
        placeholder="NIP"
        variant="unstyled"
        autoFocus
        value={formik.values.lastname}
        onChangeText={(text) => {formik.setFieldValue("nip", MD5method(text));formik.setFieldValue("nipraw", text)}}
        style={[styles.input, formik.errors.lastname && styles.inputError]}
        InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={7} ml="2" mr="2" color="muted.400" />
          </Pressable>}
       
      />
      <Button
        style={styles.btn}
        onPress={formik.handleSubmit}
        isLoading={formik.isSubmitting}
      >
        Aplicar
      </Button>
    </View>
  );
}