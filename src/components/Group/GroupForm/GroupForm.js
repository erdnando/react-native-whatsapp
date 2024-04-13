import { useState, useEffect,useRef } from "react";
import { View, Keyboard, Platform,TextInput } from "react-native";
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
  let [idMessage, setIdMessage] = useState("");
  const [focusInput, setFocusInput] = useState(false);
  const inputMessageRef=useRef(null);
  const [showIconSendText, setShowIconSendText] = useState(false);
  
  const handleFocus = () => {
    console.log("foco puesto....")
    //setFocusInput(true);
    setShowIconSendText(true);
  };
  
  const handleBlur = () => {
    console.log("foco perdido....")
    //setFocusInput(true);
    setShowIconSendText(false);
  };

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
      setIdMessage("");
    });

    return () => {
      showKeyboardSub.remove();
      hideKeyboardSub.remove();
    };
  }, []);


  //EventListener:editingMessage
  useEffect(() => {

    setIdMessage("");
  
      try {
        
        //=================================================================
        const eventEditMessage = EventRegister.addEventListener("editingMessage", async data=>{
          setIdMessage("");
          console.log("message._id:"+data._id);
          setIdMessage(data._id);
          console.log("message.message:"+data.message);
          console.log("message.group:"+data.group);
          console.log("message.tipo_cifrado:"+data.tipo_cifrado);
          console.log("message.type:"+data.type);
          
          formik.setFieldValue("message", data.message);
          setFocusInput(true);
          inputMessageRef.current.focus();
          
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventEditMessage);
        }
        //================================================================
        

      } catch (error) {
        console.error(error);
      }
  
  }, []);

   //EventListener:deletingMessage
   useEffect(() => {

    setIdMessage("");
   
      try {
        
         //=================================================================
         const eventDeleteMessage = EventRegister.addEventListener("deletingMessage", async data=>{
          setIdMessage("");
          console.log("message._id:"+data._id);
          setIdMessage(data._id);
          console.log("message.message:"+data.message);
          console.log("message.group:"+data.group);
          console.log("message.tipo_cifrado:"+data.tipo_cifrado);
          console.log("message.type:"+data.type);
          
    
         await groupMessageController.deleteMessage(accessToken , groupId , "", tipoCifrado,data._id );
          
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventDeleteMessage);
        }
        //================================================================

      } catch (error) {
        console.error(error);
      }
   // })();
  }, []);
  
  

  //formik definition & onsubmit
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      //onSendMessage
      try {
        setKeyboardHeight(0);
        Keyboard.dismiss();
       
        //process();
       //Envio de mensajes
       console.log("tipo cifrado::"+tipoCifrado);
       
       if(idMessage==""){
        //llamada normal, nuevo mensaje
        await groupMessageController.sendText(accessToken , groupId , formValue.message , tipoCifrado );
       }else{
        //edicion de mensaje
        setIdMessage("");
       
        await groupMessageController.sendTextEditado(accessToken , groupId , formValue.message , tipoCifrado,idMessage );
       }
       setFocusInput(false);

        formik.handleReset();
        //clearing input after sending a message
        formik.setFieldValue("message", "");

  
        setIdMessage("");
        
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <View style={[styles.content, { bottom: keyboardHeight }]}>
      

     
       
      <Select borderColor={'transparent'} paddingTop={1} paddingBottom={1} style={styles.select} minWidth={81} maxWidth={82} 
       selectedValue={tipoCifrado} dropdownIcon={<Icon as={MaterialCommunityIcons} name="key" style={styles.iconCrypto} />}
       onValueChange={itemValue => setTipoCifrado(itemValue)}>
          <Select.Item label="AES" value="AES" />
          <Select.Item label="3DES" value="3DES" />
          <Select.Item label="RCA" value="RCA" />
          <Select.Item label="RAB" value="RABBIT" />
      </Select>

      <View style={styles.inputContainer}>

        <TextInput  
          ref={inputMessageRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          borderColor= {focusInput ? 'red' : 'transparent'}
          placeholder="Mensaje al grupo..."
          placeholderTextColor="gray" 
          variant="unstyled"
          style={styles.input}
          value={formik.values.message}
          onChangeText={(text) => formik.setFieldValue("message", text)}
          onEndEditing={!formik.isSubmitting && formik.handleSubmit}
        />
        <IconButton display={showIconSendText ? 'flex':'none'}
          icon={<Icon as={MaterialCommunityIcons} name="send-lock-outline"  /> }
          style={styles.iconSend}
          onPress={!formik.isSubmitting && formik.handleSubmit}
        />
        
         
      </View>
      <View display={showIconSendText ? 'none':'flex'} style={ {flexDirection:'row',alignItems:'center' }}>
          <SendMedia groupId={groupId}  />
          <IconButton icon={<Icon as={MaterialCommunityIcons} name="microphone" style={styles.iconAudio} /> }       />
        </View>
    </View>
  );
}
