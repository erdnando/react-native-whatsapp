import { useState, useEffect,useRef } from "react";
import { View, Keyboard, Platform } from "react-native";
import { Input, IconButton, Icon, Select,Alert } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { GroupMessage } from "../../../api";
import { useAuth } from "../../../hooks";
import { SendMedia } from "./SendMedia";
import { initialValues, validationSchema } from "./GroupForm.form";
import { styles } from "./GroupForm.styles";
import { EventRegister } from "react-native-event-listeners";

const groupMessageController = new GroupMessage();

export function GroupForm(props) {

  const { groupId } = props;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { accessToken } = useAuth();
  let [tipoCifrado, setTipoCifrado] = useState("AES");

  const inputMessageRef = useRef(null);

  //Manage keyboard
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


  //EventListener:editingMessage
  useEffect(() => {
    (async () => {
      try {
        
       
        //=================================================================
        const eventEditMessage = EventRegister.addEventListener("editingMessage", async data=>{
          console.log("editing message..."+data);
          //formik.initialValues["message"]=data;
          //console.log(inputRef.current);
         
          //inputMessageRef.current.focus();
         
         
         // 
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventEditMessage);
        }
        
        
        //================================================================

      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  

  //formik definition & onsubmit
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
        
        //formik.initialValues["message"]="xxxx";
        //inputMessageRef.current.focus();
        
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
           ref={inputMessageRef}
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
