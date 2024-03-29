import { useState, useEffect } from "react";
import { View, Keyboard, Platform } from "react-native";
import { Input, IconButton, Icon, Select,VStack } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { GroupMessage } from "../../../api";
import { useAuth } from "../../../hooks";
import { SendMedia } from "./SendMedia";
import { initialValues, validationSchema } from "./GroupForm.form";
import { styles } from "./GroupForm.styles";
import {Picker} from '@react-native-picker/picker';

const groupMessageController = new GroupMessage();

export function GroupForm(props) {
  const { groupId } = props;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { accessToken } = useAuth();
  let [tipoCifrado, setTipoCifrado] = useState("AES");

  useEffect(() => {
    const showKeyboardSub = Keyboard.addListener("keyboardDidShow", (e) => {
      const { startCoordinates } = e;

      if (Platform.OS === "ios") {
        setKeyboardHeight(startCoordinates.height + 65);
      }
    });

    const hideKeyboardSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showKeyboardSub.remove();
      hideKeyboardSub.remove();
    };
  }, []);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        setKeyboardHeight(0);
        Keyboard.dismiss();

        //process();
       //Envio de mensajes
       console.log("tipo cifrado::"+tipoCifrado);
        await groupMessageController.sendText(accessToken , groupId , formValue.message , tipoCifrado );

        formik.handleReset();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <View style={[styles.content, { bottom: keyboardHeight }]}>
      

      <SendMedia groupId={groupId} />
       
     

      <Select borderColor={'transparent'} paddingTop={1} paddingBottom={1} style={styles.select} minWidth={81} maxWidth={82} 
       selectedValue={tipoCifrado} dropdownIcon={<Icon as={MaterialCommunityIcons} name="key" style={styles.iconCrypto} />}
       onValueChange={itemValue => setTipoCifrado(itemValue)}>
          <Select.Item label="AES" value="AES" />
          <Select.Item label="3DES" value="3DES" />
          <Select.Item label="RCA" value="RCA" />
          <Select.Item label="RAB" value="RABBIT" />
      </Select>




      <View style={styles.inputContainer}>

        <Input
          placeholder="Mensaje al grupo..."
          variant="unstyled"
          style={styles.input}
          value={formik.values.message}
          onChangeText={(text) => formik.setFieldValue("message", text)}
          onEndEditing={!formik.isSubmitting && formik.handleSubmit}
        />
        <IconButton
          icon={<Icon as={MaterialCommunityIcons} name="send-lock-outline"  /> }
          padding={0}
          style={styles.iconSend}
          onPress={!formik.isSubmitting && formik.handleSubmit}
        />
      </View>
    </View>
  );
}
