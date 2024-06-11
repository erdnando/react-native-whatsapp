import { useState, useEffect } from "react";
import { View, Fab,Modal, Icon, FormControl,Input,Button, Text, useToast, Box } from "native-base";
import {  Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { GroupMessage, UnreadMessages,Auth } from "../../api";
import { useAuth } from "../../hooks";
import { HeaderGroup } from "../../components/Navigation";
import { LoadingScreen } from "../../components/Shared";
import { ListMessages, GroupForm } from "../../components/Group";
import { ENV, socket,Decrypt,Encrypt } from "../../utils";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import * as statex$ from '../../state/local'
import { UPDATE_STATE_ALLMESSAGES,ADD_STATE_ALLMESSAGES, GET_STATE_ALLMESSAGESBYID,UPDATE_STATE_GROUP_LLAVE,
  GET_STATE_GROUP_LLAVE,ADD_STATE_GROUP_LLAVE, ADD_STATE_MY_DELETED_MESSAGES } from '../../hooks/useDA';
import NetInfo from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";




const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function GroupScreen() {

  const navigation = useNavigation();
  const unsubscribe = NetInfo.addEventListener(state => {
    console.log('Is connected?', state.isConnected);
    statex$.default.isConnected.set(state.isConnected)
  });

  const { params: { groupId, tipo, creator }, } = useRoute();
  const { accessToken, user } = useAuth();
  const [messages, setMessages] = useState(null);
  const [isGroupCreator, setIsGroupCreator] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nuevaLlave, setNuevaLlave] = useState("");
  const [tituloModal, setTituloModal] = useState('');
  const [ lblMensaje, setLblMensaje] = useState('')
  const toast = useToast();
  

  //EventListener:: decifra mensajes
  useEffect(() => {
    console.log("statex$.default.isConnected.get()")
    console.log(statex$.default.isConnected.get())
    

       const eventMessages = EventRegister.addEventListener("setCifrado", async isCypher=>{
         
              try {
               
                (async () => {
                  console.log("setCifrado por evento:::"+ isCypher);
                  //setCryptMessage(data);
                  await authController.setCifrado(isCypher);

                  let response=null;
                  try {
                    //Validation offline
                    if( statex$.default.isConnected.get() ){
                       response = await groupMessageController.getAll(accessToken, groupId);

                       //validatin if exists data sociated to this groupId locally
                       //====================================================================================
                        let resAux=null;
                        await GET_STATE_ALLMESSAGESBYID(groupId).then(result =>{
                              resAux=result.rows._array;
                              console.log("resAux.length grupos????????");
                              console.log(resAux.length);
                              console.log(resAux);

                              if(resAux.length==0){
                                //add it
                                console.log("ADD_STATE_ALLMESSAGES " + groupId);
                                ADD_STATE_ALLMESSAGES(JSON.stringify(response), groupId,'','abierto');
                              }else{
                                console.log("UPDATE_STATE_ALLMESSAGES " + groupId);
                                UPDATE_STATE_ALLMESSAGES(JSON.stringify(response), groupId);
                              }
                            
                          });
                        //====================================================================================

                    }else{
                      //======================================================================================
                      console.log("offline, getting from local db");
                      console.log("GET_STATE_ALLMESSAGESBYID " + groupId);
          
                      await GET_STATE_ALLMESSAGESBYID(groupId).then(result =>{
                            response=result.rows._array;
                            response =JSON.parse(response[0].valor);
                      }); 
                     //======================================================================================
                    }
                   //==========================================
                    const unlockedMessages = response.messages;
                    //console.log(unlockedMessages);

                    if(isCypher=="NO"){
                     //=========================================================================================
                     let estatusLLave =true;
                          unlockedMessages.map((msg) => {

                            if(msg.type=="TEXT"){
                                  //================================================================================
                                    msg.message = Decrypt(msg.message,msg.tipo_cifrado,tipo);
                                   console.log("->"+msg.message +"<-")
                                    if(msg.message===""){
                                      console.log("seteando mal decifrado")
                                      estatusLLave=false
                                      msg.message="Llave no valida ☠️"
                                    }
                                    
                                    if(msg.email_replied != null){
                                      msg.message_replied= Decrypt(msg.message_replied,msg.tipo_cifrado_replied,tipo);

                                      if(msg.message===""){
                                        console.log("seteando mal decifrado")
                                        msg.message="Llave no valida ☠️"
                                        estatusLLave=false
                                      }
                                    }
                                  //================================================================================
                            }else{
                                  //==================================================================================
                                  console.log("msg.message imagen o  archivo")
                                  console.log(estatusLLave)

                                  if(estatusLLave==false){
                                    msg.message="Llave no valida ☠️"
                                  console.log("msg.message imagen o  archivo hay q mantenerlo encryptado")
                                  }else
                                  console.log(msg.message)
                                  //todo bien con lo archivos
                                  //==================================================================================
                            }
                          
                          });
                      //=========================================================================================
                    }else{
                      unlockedMessages.map((msg) => {
                        if(msg.type=="IMAGE"){
                          msg.message = "images/cryptedImagex.png";
                        }
                        if(msg.type=="FILE"){
                          msg.message = "images/cryptedImagex.png";
                        }
                       
                      });
                    }
                  
                    //==========================================
                    console.log("setting mensajes");
                    //console.log(unlockedMessages);
                   // console.log("===============================");
                   // setMessages(unlockedMessages);
                    setMessages([]);
                    setMessages( unlockedMessages);
                    unreadMessagesController.setTotalReadMessages(groupId, response.total);

                  } catch (error) {
                    console.log("Error 1")
                    console.error(error);
                  }
                })();
              } catch (error) {
                console.log("Error 3")
                console.error(error);
              }
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventMessages);
        }
  }, []);

  //Set ACTIVE_GROUP_ID
  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(ENV.ACTIVE_GROUP_ID, groupId);
    })();

    return async () => {
      await AsyncStorage.removeItem(ENV.ACTIVE_GROUP_ID);
    };
  }, []);

  //Get messages
  useEffect(() => {
    
   getAllMessages();

  }, [groupId]);


  //EventListener:deletingMessage for me
  useEffect(() => {

      try {
        
         //=================================================================
         const eventDeleteMessageForMe = EventRegister.addEventListener("deletingMessageForMe", async data=>{
          
          console.log("Deleteing for me message")
          console.log("message._id:"+data._id);
          console.log("message.message:"+data.message);
          console.log("message.group:"+data.group);
          console.log("message.tipo_cifrado:"+data.tipo_cifrado);
          console.log("message.type:"+data.type);
          statex$.default.moveScroll.set(false);
          //======================================================
          ADD_STATE_MY_DELETED_MESSAGES(data._id)

          
          
    
          getAllMessages();
          
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventDeleteMessageForMe);
        }
        //================================================================

      } catch (error) {
        console.error(error);
      }
   // })();
  }, []);

  //subscribe sockets
  useEffect(() => {

    if(statex$.default.isConnected.get()){
      
      socket.emit("subscribe", groupId);
      socket.on("message", newMessage);
      socket.on("reloadmsgs", getAllMessages);

      return () => {
        socket.emit("unsubscribe", groupId);
        socket.off("message", newMessage);
        socket.off("reloadmsgs", getAllMessages);
      };
    }

  }, [groupId, messages]);


  //get all messages
  const getAllMessages = () => {
   // console.log("reloading message:::GroupScreen");
    //=================================================================================
    (async () => {

      let response = null;
      try {
        const cifrados = await authController.getCifrado(); 
       // console.log("cifrados");
       // console.log(cifrados);

        if( statex$.default.isConnected.get() ){
          console.log("online, getting from internet db")
          response = await groupMessageController.getAll(accessToken, groupId);

          console.log("mensajes en el server del grupo" + groupId)
          

          let resAux=null;
          await GET_STATE_ALLMESSAGESBYID(groupId).then(result =>{
                resAux=result.rows._array;
                console.log("resAux.length grupos????????");
                console.log(resAux.length);
                console.log(resAux);

                if(resAux.length==0){
                  //add it
                  console.log("ADD_STATE_ALLMESSAGES " + groupId);
                  ADD_STATE_ALLMESSAGES(JSON.stringify(response), groupId,'','abierto');
                }else{
                  console.log("UPDATE_STATE_ALLMESSAGES " + groupId);
                  UPDATE_STATE_ALLMESSAGES(JSON.stringify(response), groupId);
                }
              
            }); 

        }else{
            console.log("offline, getting from local db");
            console.log("GET_STATE_ALLMESSAGESBYID " + groupId);

            await GET_STATE_ALLMESSAGESBYID(groupId).then(result =>{
                  response=result.rows._array;
                  response =JSON.parse(response[0].valor);
            }); 
        }
       

        //console.log("mensajes del grupo")
        //console.log(response)

        if(cifrados=="SI"){
          //====================Mantiene cifrados los TXT y coloca imagen q represente un cifrado========================================================
          const lockedMessages = response.messages;
          lockedMessages.map((msg) => {
              if(msg.type=="IMAGE"){
                console.log("=====imagen=========")
                console.log(msg.message)
                msg.message = "images/cryptedImagex.png";
              }

              if(msg.type=="FILE"){
                console.log("=====file=========")
                console.log(msg.message)
                msg.message = "images/cryptedImagex.png";
              }

            });

            setMessages(lockedMessages);
        }else{
          //=======================Decifra los mensajes=======================================================
        
            const unlockedMessages = response.messages;

            unlockedMessages.map((msg) => {
      
              if(msg.type=="TEXT"){
               // console.log("========texto=======================")
                //console.log(msg);
                msg.message = Decrypt(msg.message,msg.tipo_cifrado, tipo);
                //console.log("========texto=======================")
               // console.log(msg);

                if(msg.email_replied != null){
                  msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied, tipo);
                }
              }

               if(msg.type=="IMAGE" || msg.type=="FILE"){
                   // console.log("========imagen or file=======================")
                    msg.message =msg.message;
                    console.log(msg);
              }
             
            });
            setMessages(unlockedMessages);
         
          //==============================================================================
        }
       // console.log("::::::::::::::GroupScreen:::::::::::::::::::::::::::");
        unreadMessagesController.setTotalReadMessages(groupId, response.total);

      } catch (error) {
        console.error(error);
      }
    })();

    return async () => {
      const response = await groupMessageController.getAll(accessToken, groupId );
      unreadMessagesController.setTotalReadMessages(groupId, response.total);
    };
   //=================================================================================
  };

  //when newMessage is required, call this instruction
  const newMessage = (msg) => {
   
    (async () => {

    console.log("identificando nuevo mensaje:::::")

 


     //==========================================================

     try {
          //Get all messages
          if(statex$.default.isConnected.get()){

              response = await groupMessageController.getAll(accessToken, groupId);

              console.log("Persistiendo UPDATE_STATE_ALLMESSAGES")
              //console.log(JSON.stringify(response))
              UPDATE_STATE_ALLMESSAGES(JSON.stringify(response),groupId)


               //TODO: notifying user who send the message that it has been read
               //Por q estoy dentro del chat e inmediatamente hay q avisarle que ya se leyo
                console.log("notificando que su mensaje ha sido leido a:")
                console.log( statex$.default.userWhoSendMessage.get())



                const msgOrigen={
                  idUser: msg.user._id,
                  idMsg: msg._id,
                }
                statex$.default.userWhoSendMessage.set(msgOrigen)

                await groupMessageController.notifyRead(
                  accessToken,
                  msg.user._id,
                  msg._id
                );


              }
      } catch (error) {
        console.log("error::::")
        console.log(error)
      }
//==========================================================     
    let msgOriginal=msg.message;;
    if(msg.type=="TEXT"){

      msg.message=Decrypt(msg.message, msg.tipo_cifrado, tipo);

      if(msg.email_replied != null){
        msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied, tipo);

        //find message original and decryp it on message array
        try{
          messages.map((msgx) => {

            if( Decrypt(msgx.message,msgx.tipo_cifrado, tipo) == msg.message_replied){
              msgx.message = msg.message_replied;
            }
           
          });
          setMessages(messages);
        }catch(error){
          console.log("error al validar xxx")
        }
        

      }

      const isMe = user._id === msg.user._id;
      console.log("userId who send a message::::",  msg.user._id)
      
     

      console.log(msg.user._id)
      console.log(user._id)
      console.log(isMe)
    }
   
    //==================================================
      const cifrados = await authController.getCifrado(); 

      if(cifrados=="SI"){
        //setCryptMessage(true);
        if(msg.type=="TEXT"){
          msg.message=Encrypt(msg.message,msg.tipo_cifrado);
        }else{ //img or filr
          msg.message = "images/cryptedImagex.png";
        }
      }
     
      setMessages([...messages, msg]);
    })();

  };

  const presentaModal = ()=>{
    console.log("Aplicando llave")
    

    console.log("Datos")

    console.log("llave actual")
    console.log(statex$.default.llaveGrupoSelected.get())
    console.log('user._id')
    console.log(user._id)
    console.log("groupId")
    console.log(groupId)
    console.log("creator._id")
    console.log(creator._id)

    if(user._id === creator._id){
      console.log("Bienvenido creator del grupo")
      setIsGroupCreator(true)
      setTituloModal("Modifique la llave")
      setLblMensaje('Asegurese de notificar al otro miembro del grupo del cambio para que puedan seguir interactuando');
    }else{
      setTituloModal("Ingrese la llave compartida")
      setLblMensaje('Ingrese la llave y no la comparta con nadie')
    }

    setShowModal(true)

    
  }
  const aplicaLLave =async ()=>{


    if(nuevaLlave.length < 10){
         
      toast.show({
        placement: "top",
        render: () => {
          return <Box bg="#0891b2" px="4" py="3" rounded="md" mb={8} style={{borderTopColor:'white', borderTopWidth:3,color:'white', zIndex:3000 }}>
                <Text style={{color:'white'}}>La llave es requerida y debe ser de al menos 50 caracteres!</Text>
                </Box>;
        }
      });

      return;
    }

    console.log("Aplicando llave")
    console.log("Datos")
    console.log("llave actual")
    console.log(statex$.default.llaveGrupoSelected.get())
    console.log('user._id')
    console.log(user._id)
    console.log("groupId")
    console.log(groupId)
    console.log("creator._id")
    console.log(creator._id)
   
    if(user._id === creator._id){
      //=========================================================================================
       //get all messages of the group
       const respAllMessages = await groupMessageController.getAll(accessToken, groupId);

       console.log("decifrando con llave vieja")
       console.log(statex$.default.llaveGrupoSelected.get())

       const unlockedMessages = respAllMessages.messages;
         //loop group's messages and apply new crypted key, one by one
         unlockedMessages.map(async (msg) => {
     
           if(msg.type=="TEXT"){
             //decrypt message
             msg.message = Decrypt(msg.message, msg.tipo_cifrado)
             console.log("mensaje decifrado")
             console.log(msg.message)
             //apply new crypted message

             await groupMessageController.updateCifrados(accessToken, groupId, msg.message,msg.tipo_cifrado,msg._id, "cerrado", nuevaLlave);
           }

         });

         UPDATE_STATE_GROUP_LLAVE(groupId, nuevaLlave);
         statex$.default.llaveGrupoSelected.set(nuevaLlave);

         
      //=========================================================================================
    }else{
      //check if it exists, otherwise add it
      let responsex=[];
      await GET_STATE_GROUP_LLAVE(groupId).then(result =>{
            responsex=result.rows._array;

            if(responsex.length==0){
                //Set new key in state and update local db
                ADD_STATE_GROUP_LLAVE(groupId, nuevaLlave);
            }else{
                //Set new key in state and update local db
                UPDATE_STATE_GROUP_LLAVE(groupId, nuevaLlave);
            }
      }); 

     
      statex$.default.llaveGrupoSelected.set(nuevaLlave);
     
    }
    setShowModal(false)
    
    navigation.goBack();
  }

  if (!messages) return <LoadingScreen />;


  return (
    <>
      <HeaderGroup groupId={groupId}  />

      <View flex={1} >
        <ListMessages messages={messages} />

        <Fab display={tipo=="cerrado"? 'flex':'none'} renderInPortal={false} shadow={2}   bottom={120} size="sm" onPress={presentaModal}
             icon={<Icon color="white" as={MaterialCommunityIcons} name="key" size="4" />} label="Su llave" />

        <GroupForm groupId={groupId} tipo={tipo} />
      </View>




      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />

          <Modal.Header>{tituloModal}</Modal.Header>

          <Modal.Body>
            <FormControl>
             
              <Input w={{base: "100%", md: "25%"}} type="text" multiline={true} maxLength={200}
               onChangeText={(text) => setNuevaLlave(text)}
              InputRightElement={  <Icon as={<Icon as={MaterialCommunityIcons} name="key" 
              style={{ 
                fontSize:22,
                top:4,
                marginRight:6,
                width:25
              }} /> } size={8} mr="8" color="muted.400" />
                                } placeholder="Su llave" />

              <Text  style={{marginTop:10}}>{lblMensaje}</Text>

            </FormControl>
          </Modal.Body>

          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                
              setShowModal(false);
            }}>
                Cancelar
              </Button>
              <Button               
              onPress={() => {
                aplicaLLave();
            }}>
                Aplicar
              </Button>
            </Button.Group>
          </Modal.Footer>


        </Modal.Content>
      </Modal>

    </>
  );
}