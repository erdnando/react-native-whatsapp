import { useState, useEffect,useRef, } from "react";
import { View, Keyboard, Platform,TextInput,Text } from "react-native";
import { Input, IconButton, Icon, Select,Actionsheet,useDisclose,Box } from "native-base";
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
  const [replyMessage, setReplyMessage] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(false);
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();



  const handleFocus = () => {
    //console.log("foco puesto....")
    //setFocusInput(true);
    setShowIconSendText(true);
  };
  
  const handleBlur = () => {
    //console.log("foco perdido....")
    //setFocusInput(true);
    setShowIconSendText(false);
  };

  const onCancelReply = () => {
    console.log("cancelando reply...");
    setFocusInput(false);
    setReplyMessage(null);
    
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


    //EventListener:forwardingMessage
    useEffect(() => {

      setIdMessage("");
    
        try {
          
          //=================================================================
          const eventForwardMessage = EventRegister.addEventListener("forwardingMessage", async data=>{
            setForwardMessage(true);
            onOpen();
          });
      
          return ()=>{
            EventRegister.eventForwardMessage(eventReplyMessage);
          }
          //================================================================
          
  
        } catch (error) {
          console.error(error);
        }
    
    }, []);


    //EventListener:replyingMessage
    useEffect(() => {

      setIdMessage("");
    
        try {
          
          //=================================================================
          const eventReplyMessage = EventRegister.addEventListener("replyingMessage", async data=>{
            setIdMessage("");
            setFocusInput(true);
            console.log("mensaje replicado::::")
            console.log(data)
            setReplyMessage(data);
            inputMessageRef.current.focus();
            
          });
      
          return ()=>{
            EventRegister.removeEventListener(eventReplyMessage);
          }
          //================================================================
          
  
        } catch (error) {
          console.error(error);
        }
    
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
         setIdMessage("");
          
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
       
        console.log("idMessage:::::::")
        console.log(idMessage)
        //process();
       //Envio de mensajes
      // console.log("tipo cifrado::"+tipoCifrado);
       
       if(idMessage==""){
        //llamada normal, nuevo mensaje
        console.log("===========sending replied=============")
        console.log(replyMessage);
        console.log("=======================================")
        await groupMessageController.sendText(accessToken , groupId , formValue.message , tipoCifrado, replyMessage );
       }else{
        //edicion de mensaje
        setIdMessage("");
        await groupMessageController.sendTextEditado(accessToken , groupId , formValue.message , tipoCifrado,idMessage );
       }
       setFocusInput(false);
       setReplyMessage(null);

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
    <View style={[ { bottom: keyboardHeight }]}>

       
       {/*reply message section just as a reference to see what would you send*/}
       <Text display={replyMessage!=null?"flex":"none"} style={styles.identity}>
                  {replyMessage?.user.firstname || replyMessage?.user.lastname
                    ? `${replyMessage?.user.firstname || ""} ${replyMessage?.user.lastname || ""}`
                    : replyMessage?.user.email.substring(0,30) }
        </Text>
      
      <View display={replyMessage!=null?"flex":"none"} style={{flexDirection: 'row', marginLeft:5,marginRight:30,width:'90%' ,backgroundColor:'black',padding:10 }}>
        <Text style={styles.textReply}>{replyMessage!=null ? replyMessage.message: ""}</Text>
        <IconButton onPress={onCancelReply} icon={<Icon as={MaterialCommunityIcons} name="close" style={styles.iconCloseReply} /> } /> 
      </View>
    

      
    {/*section to select chyper mode, input and other options ie send media*/}
       <View style={styles.content}>
          <Select borderColor={'transparent'} paddingTop={0} paddingBottom={0} style={styles.select} minWidth={81} maxWidth={82} 
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
              multiline
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

    {/*bottom modal*/}
    
    
       
        <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
       

            <Box  w="100%" h={260} px={4} justifyContent="center">
            <Text fontSize="20" color="gray.500" _dark={{
              color: "gray.300"
            }}>
                Enviar a
              </Text>
            </Box>


        </Actionsheet.Content>



         
        </Actionsheet>
     

    </View>
  );
}
