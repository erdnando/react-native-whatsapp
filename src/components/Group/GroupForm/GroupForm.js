import { useState, useEffect,useRef,useCallback } from "react";
import { View, Keyboard, Platform,TextInput,Text } from "react-native";
import { Input, IconButton, Icon, Select,Actionsheet,useDisclose,Checkbox,VStack,Button,ScrollView,useTheme,Avatar,HStack,Center,Box,Heading,inputValue } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { GroupMessage,Group } from "../../../api";
import { useAuth } from "../../../hooks";
import { SendMedia } from "./SendMedia";
import { initialValues, validationSchema } from "./GroupForm.form";
import { styles } from "./GroupForm.styles";
import { EventRegister } from "react-native-event-listeners";
import { map, size } from "lodash";
import { ENV } from '../../../utils'

const groupMessageController = new GroupMessage();
const groupController = new Group();

export function GroupForm(props) {

  const { groupId } = props;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { accessToken,user } = useAuth();
  let [tipoCifrado, setTipoCifrado] = useState("AES");
  let [idMessage, setIdMessage] = useState("");
  const [focusInput, setFocusInput] = useState(false);
  const inputMessageRef=useRef(null);
  const [showIconSendText, setShowIconSendText] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(false);
  const [groups, setGroups] = useState(null);
  const [canForward, setCanForward] = useState(false);

  
//updating checkBoxes status of the list
  const handleStatusChange = index => {

    setGroups(prevList => {
      const newList = [...prevList];
      newList[index].isSelected = !newList[index].isSelected;
      return newList;
    });

      //evaluating selected status
      setCanForward(false);
      groups.map((msgx) => {
        if(msgx.isSelected){
          setCanForward(true);
        } 
      });
    // console.log(groups);

  };

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  const {
    colors
  } = useTheme();


  const handleForward= ()=>{
              
      console.log("sending msg into selected group:::::::::::");
    
      groups.map(async (msgx) => {

        if(msgx.isSelected){
          console.log(msgx)
            await groupMessageController.sendText(accessToken , msgx._id , "reenviado::"+forwardMessage.message, msgx.tipoCifrado, null );
        } 
      });
      onClose();
    
      
   
  }
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
            console.log("grupo desde donde salio el forward::::")
            console.log(data.group);
            setForwardMessage(true);
            //get groups from API
       
              onOpen();
                try {

                  setForwardMessage(data);
                  //Get all messages
                  const response = await groupController.getAll(accessToken);
        
                  const result = response.filter(gpo => gpo._id != data.group).sort((a, b) => {
                    return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
                  });


                  //addin isSelected property on runtime
                  result.map((gpo) => {
                      gpo.isSelected =false;
                  });
                 
                  console.log("obteniendo grupos....")
                  console.log(result)
                  setGroups(result);
                 

                 
                } catch (error) {
                  console.error(error);
                }
           
            
          });
      
          return ()=>{
            EventRegister.removeEventListener(eventForwardMessage);
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
        //replyMessage==null if you like a normal message

        console.log("===========sending replied=============")
        console.log(replyMessage);
        console.log("=======================================")
        //if replyMessage is null, then it's a normal message
        //else it's a reply
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

      {/*forward group*/}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
       
            <View style={{height:260,width:'100%', padding:8}}>
              
            <Text style={{fontWeight:'bold',fontSize:16,marginBottom:5}} >Seleccione el grupo:</Text>

               <ScrollView h="full" style={{padding:8,borderRadius:8 }}>
               <Center w="100%">
                  <Box  w="100%" style={{paddingHorizontal:5}}>
                   
                      <VStack space={4}>
                        {
                          groups?.map((group,index) => 

                          <HStack w="100%" justifyContent="space-between" alignItems="center" key={group._id.toString()}>

                              <Checkbox isChecked={group.isSelected} onChange={() => handleStatusChange(index)} value={group.name} aria-label={group.name}></Checkbox>
                              <Text width="100%" flexShrink={1} textAlign="left" mx="2" strikeThrough={group.isSelected} _light={{
                                    color: group.isSelected ? "gray.400" : "coolGray.800"}} _dark={{color: group.isSelected ? "gray.400" : "coolGray.50"
                                  }} onPress={() => console.log("actualizando estatus...")}>
                                    {"   "+group.name}
                              </Text>
                          </HStack>)
                          }
                      </VStack>
                  </Box>
                </Center>
              </ScrollView>


               <View style={{height:16}}></View>
               <Button isDisabled={canForward?false:true} style={{backgroundColor:'black'}}  onPress={handleForward}>Reenviar</Button>

               <View style={{height:0}}></View>
            </View>
        </Actionsheet.Content>
        </Actionsheet>

    </View>
  );
}
