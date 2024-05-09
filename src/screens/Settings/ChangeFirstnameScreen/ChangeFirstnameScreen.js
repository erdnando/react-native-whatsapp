import { useState, useEffect } from "react";
import { View,Alert } from "react-native";
import { Input, Button } from "native-base";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { User } from "../../../api";
import { useAuth } from "../../../hooks";
import { initialValues, validationSchema } from "./ChangeFirstnameScreen.form";
import { styles } from "./ChangeFirstnameScreen.styles";
import * as statex$ from '../../../state/local'

const userController = new User();

export function ChangeFirstnameScreen() {
  const navigation = useNavigation();
  const { accessToken, updateUser , email} = useAuth();
  const [connectStatus,setConnectStatus]=useState(false);


  useEffect(() => {
    
    if(statex$.default.flags.connectStatus.get()){
      setConnectStatus(true)//original true
    }else{
      setConnectStatus(false)
    }
    
  }, []);

  const alertaNoInternet = ()=>{
    Alert.alert ('Modo offline. ','La aplicacion esta en modo offline, por lo que no podra generar nuevos mensajes u operaciones',
      [{  text: 'Ok',
          onPress: async ()=>{
            
          }
        } ]);
  }



  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        //changing alias


         //================valida offline=============================
         if(!connectStatus){
          Alert.alert ('Modo offline. ','La aplicacion esta en modo offline, por lo que no podra generar nuevos mensajes u operaciones',
          [{  text: 'Ok',
              onPress: async ()=>{ }
            } ]);

            return;
      }
      //=======================================================



        const dataUser = { firstname: formValue.firstname };// email: formValue.firstname

        await userController.updateUserAliasDB(email, dataUser);

        updateUser("firstname", formValue.firstname);

        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <View style={styles.content}>
      <Input
        placeholder="Alias"
        variant="unstyled"
        autoFocus
        value={formik.values.firstname}
        onChangeText={(text) => formik.setFieldValue("firstname", text)}
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