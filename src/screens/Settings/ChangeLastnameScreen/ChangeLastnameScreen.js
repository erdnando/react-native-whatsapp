import { View, Pressable, Text } from "react-native";
import { useState, useEffect } from "react";
import { Input, Button,Icon, AlertDialog } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { User } from "../../../api";
import { useAuth } from "../../../hooks";
import { initialValues, validationSchema } from "./ChangeLastnameScreen.form";
import { styles } from "./ChangeLastnameScreen.styles";
import { MD5method } from "../../../utils";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const userController = new User();

export function ChangeLastnameScreen() {
  const navigation = useNavigation();
  const { accessToken, updateUser } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [nip, setNip] = useState('');
  const [nipError, setNipError] = useState(false);
  const [show, setShow] = useState(false);
  const [showAdvertencia, setShowAdvertencia] = useState(true);
  const onCloseAdvertencia = () => {
    setShowAdvertencia(false);
    navigation.goBack();
  }

  const handleClick = () => setShow((prevState) => !prevState);


  const onValidateNIP = async () => {

   // console.log("validando nip:::::::::::");
    //call api to validate nip 
    const response = await userController.getMe(accessToken);

    if(MD5method(nip.toString()) == response.nip){
       // console.log("NIP OK");
        setShowAdvertencia(false);
        setNipError(false)
        
    }else{
      setNipError(true)
    }



    
  }

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
       // console.log("set nip:::::");
       // console.log(formValue); //MD5method
       // formValue.nip = MD5method(formValue.nip)
        await userController.updateUser(accessToken, formValue);

        //hash nip
        updateUser("nip", MD5method(formValue.nip));
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
        keyboardType="number-pad"
        maxLength={10}
        value={formik.values.lastname}
        onChangeText={(text) => formik.setFieldValue("nip", MD5method(text))}
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






      <AlertDialog  isOpen={showAdvertencia} onClose={onCloseAdvertencia}>
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Ingrese NIP anterior</AlertDialog.Header>
                <AlertDialog.Body>

                    <Input w={{base: "100%", md: "25%"}} type={showPwd ? "text" : "password"}
                  onChangeText={(text) => setNip(text)}
                  InputRightElement={<Pressable onPress={() => setShowPwd(!showPwd)}>
                                        <Icon as={<Icon as={MaterialCommunityIcons} name={showPwd ? "eye" : "eye-off"} style={styles.iconPwdNip} /> } size={8} mr="8" color="muted.400" />
                                    </Pressable>} placeholder="Su NIP" />

                    <Text display={nipError? 'flex':'none'} style={{color:'red'}}>NIP incorrecto, intente otra vez!</Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button variant="unstyled" colorScheme="coolGray" onPress={onCloseAdvertencia} >
                      Cancelar
                    </Button>
                   <Button colorScheme="danger" onPress={onValidateNIP}>
                      Validar NIP
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>


    </View>
  );
}