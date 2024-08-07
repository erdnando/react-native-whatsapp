import { useState, useEffect,useCallback } from "react";
import { View, Fab,Modal, Icon, FormControl,Input,Button, Text, useToast, Box } from "native-base";
import { Alert } from "react-native";
import { useRoute, useNavigation,useFocusEffect } from "@react-navigation/native";
import { GroupMessage, UnreadMessages,Auth } from "../../api";
import { useAuth } from "../../hooks";
import { HeaderGroup } from "../../components/Navigation";
import { LoadingScreen } from "../../components/Shared";
import { ListMessages, GroupForm } from "../../components/Group";
import { ENV, socket,Decrypt,Encrypt,screens } from "../../utils";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as statex$ from '../../state/local'
import { UPDATE_STATE_ALLMESSAGES,ADD_STATE_ALLMESSAGES, GET_STATE_ALLMESSAGESBYID,UPDATE_STATE_GROUP_LLAVE,
  GET_STATE_GROUP_LLAVE,ADD_STATE_GROUP_LLAVE, ADD_STATE_MY_DELETED_MESSAGES } from '../../hooks/useDA';
import NetInfo from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";


const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();


export function GroupScreen() {

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const unsubscribe = NetInfo.addEventListener(state => {
  
    statex$.default.isConnected.set(state.isConnected)
    
    if(state.isConnected==false){
      statex$.default.reconnectSockets.set(true);
     }else{

      if(statex$.default.reconnectSockets.get()==true){

        //...

        statex$.default.reconnectSockets.set(false);
      }
      
    }
    


  });

  const { params: { groupId, tipo, creator }, } = useRoute();
  const { accessToken, user } = useAuth();
  const [messages, setMessages] = useState(null);
  const [isGroupCreator, setIsGroupCreator] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cifradox, setCifradox] = useState(true);
  const [nuevaLlave, setNuevaLlave] = useState("");
  const [tituloModal, setTituloModal] = useState('');
  const [ lblMensaje, setLblMensaje] = useState('')
  const [ drop, setDrop] = useState('')
  const toast = useToast();
  


  //EventListener:: delete_group_message
  useEffect(() => { 
 
        const eventDeletedMessagesupdate = EventRegister.addEventListener("reloadmsgs", async msg=>{
          console.log("reloadmsgs message")
          console.log(msg)
               try {
                
                 (async () => {
                
                 
                   try {
                    statex$.default.moveScroll.set(false);
                     getAllMessages(true);
                    
                   } catch (error) {
                     console.log("Error")
                     console.error(error);
                   }
                 })();
               } catch (error) {
                 console.log("Error al actualizar listado de mensajes")
                 console.error(error);
               }
         });
     
         return ()=>{
           EventRegister.removeEventListener(eventDeletedMessagesupdate);
         }
   }, [messages]);


  //EventListener:: newMessagex
  useEffect(() => {
    
       const eventMessagesx = EventRegister.addEventListener("newMessagex", async msg=> {
         
              try {
              //  console.log("recupera msgs from db 1")
              console.log("validando si es el grupo correcto para mostraer el new msg")
              console.log(msg.group)
              console.log(groupId)
              console.log("==========================================")
                if( msg.group == groupId ){
                  newMessage(msg)
                  statex$.default.moveScroll.set(true)
                }
               
              } catch (error) {
                console.error(error);
              }
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventMessagesx);
        }


  }, [messages]);

  //EventListener:: newMessagex_me
  useEffect(() => {
  
       const eventMessagesxMe = EventRegister.addEventListener("newMessagex_me", async msg=> {
         
              try {
                newMessageMe(msg)
                statex$.default.moveScroll.set(true)
              } catch (error) {
                console.error(error);
              }
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventMessagesxMe);
        }
  }, [messages]);


  //EventListener:: decifra mensajes
  useEffect(() => {
       const eventMessages = EventRegister.addEventListener("setCifrado", async isCypher=>{
         
              try {
               
                (async () => {
                 
                  //setCryptMessage(data);
                  //await authController.setCifrado(isCypher);
                  //console.log("statex$.default.cifrado.set 1"+ isCypher);
                  statex$.default.cifrado.set(isCypher);

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
                              //console.log("resAux.length grupos????????");
                             // console.log(resAux.length);
                              //console.log(resAux);

                              if(resAux.length==0){
                                //add it
                              //  console.log("ADD_STATE_ALLMESSAGES " + groupId);
                                ADD_STATE_ALLMESSAGES(JSON.stringify(response), groupId,'','abierto');
                              }else{
                               // console.log("UPDATE_STATE_ALLMESSAGES " + groupId);
                                UPDATE_STATE_ALLMESSAGES(JSON.stringify(response), groupId);
                              }
                            
                          });
                        //====================================================================================

                    }else{
                      //======================================================================================
                      //console.log("offline, getting from local db");
                     // console.log("GET_STATE_ALLMESSAGESBYID " + groupId);
          
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
                                  // console.log("->"+msg.message +"<-")
                                    if(msg.message===""){
                                     // console.log("seteando mal decifrado")
                                      estatusLLave=false
                                      msg.message="Llave no valida ☠️"
                                    }
                                    
                                    if(msg.email_replied != null){
                                      msg.message_replied= Decrypt(msg.message_replied,msg.tipo_cifrado_replied,tipo);

                                      if(msg.message===""){
                                      //  console.log("seteando mal decifrado")
                                        msg.message="Llave no valida ☠️"
                                        estatusLLave=false
                                      }
                                    }
                                  //================================================================================
                            }else{
                                  //==================================================================================
                                //  console.log("msg.message imagen o  archivo")
                                  //console.log(estatusLLave)

                                  if(estatusLLave==false){
                                    msg.message="Llave no valida ☠️";
                                 // console.log("msg.message imagen o  archivo hay q mantenerlo encryptado")
                                  }
                                 // console.log(msg.message)
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
                   // console.log("setting mensajes");
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
    
    if(statex$.default.fromOpenning.get()){
      console.log("Cargando desde openning group")
      getAllMessages(false);
      statex$.default.fromOpenning.set(false);
    }
   

  }, [groupId,messages]);


  //EventListener:deletingMessage for me
  useEffect(() => {

      try {
        
         //=================================================================
         const eventDeleteMessageForMe = EventRegister.addEventListener("deletingMessageForMe", async data=>{
          
          statex$.default.moveScroll.set(false);
          //======================================================
          ADD_STATE_MY_DELETED_MESSAGES(data._id)

          getAllMessages(false);
          
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventDeleteMessageForMe);
        }
        //================================================================

      } catch (error) {
        console.error(error);
      }
   // })();
  }, [groupId,messages]);

  //subscribe sockets
  useEffect(() => {
    if(statex$.default.isConnected.get() && isFocused){
        socket.emit("subscribe", groupId);
        socket.on("reloadmsgs", reloadmsgs);
        socket.on("refreshDelete", refreshDelete);

          return () => {
            socket.emit("unsubscribe", groupId);
            socket.off("reloadmsgs", reloadmsgs);
            socket.off("refreshDelete", refreshDelete);
          };
    }
  }, [groupId, messages]);


  useEffect(() => {

    if(statex$.default.isConnected.get() && isFocused){
        socket.emit("subscribe", `${groupId}_seen`);
        socket.on("updateSeen", updateSeen);

        return () => {
          socket.emit("unsubscribe", `${groupId}_seen`);
          socket.off("updateSeen", updateSeen);
        };
  }

  }, [messages]);


  const updateSeen = (data) => {
   
    if( statex$.default.lastPushNotification.get() !=  data.message){
   
    if( (groupId == data.group_id) && (messages !=null && messages.length>0)){

        console.log("Actualizando mensajes....")
        statex$.default.moveScroll.set(true);
        getAllMessages(true);

    }
//==========================================================
  
  }

  };

  const refreshDelete = async (msg)=>{
   
    if( statex$.default.lastPushNotification.get() !=  msg.message){
    
      console.log("reloading....");
      console.log(msg);
      
      if(groupId== msg.group_id){
        statex$.default.moveScroll.set(false);
        getAllMessages(true);

       // setMessages(messages)
      }
      
      statex$.default.lastPushNotification.set(msg.message);

    }

  }

  const reloadmsgs = async (msg)=>{
   
    if( statex$.default.lastPushNotification.get() !=  msg.message){
    
      console.log("reloading....");
      console.log(msg);
      
      if(groupId== msg.group_id){
        statex$.default.moveScroll.set(true);
        getAllMessages(true);

       // setMessages(messages)
      }
      
      statex$.default.lastPushNotification.set(msg.message);

    }

  }

//==================================================================================================================================================================
  //get all messages
  const getAllMessages = (visto) => {
   console.log("getAllMessages:::GroupScreen");
    //=================================================================================
    (async () => {

      let response = null;
      try {
        let cifrados = statex$.default.cifrado.get();//await authController.getCifrado(); 

        if( statex$.default.isConnected.get() ){
          console.log("groupId.............." + groupId);
          console.log("accessToken.............." + accessToken);
          response = await groupMessageController.getAll(accessToken, groupId);

          
          console.log(response)
          

          let resAux=null;
          await GET_STATE_ALLMESSAGESBYID(groupId).then(result =>{
                resAux=result.rows._array;
                //console.log("resAux.length grupos????????");
               // console.log(resAux.length);
               // console.log(resAux);

                if(resAux.length==0){
                  //add it
                 // console.log("ADD_STATE_ALLMESSAGES " + groupId);
                  ADD_STATE_ALLMESSAGES(JSON.stringify(response), groupId,'','abierto');
                }else{
                 // console.log("UPDATE_STATE_ALLMESSAGES " + groupId);
                  UPDATE_STATE_ALLMESSAGES(JSON.stringify(response), groupId);
                }
              
            }); 

        }else{
           // console.log("offline, getting from local db");
           // console.log("GET_STATE_ALLMESSAGESBYID " + groupId);

            await GET_STATE_ALLMESSAGESBYID(groupId).then(result =>{
                  response=result.rows._array;
                  response =JSON.parse(response[0].valor);
            }); 
        }
       

        if(cifrados=="SI"){
          //====================Mantiene cifrados los TXT y coloca imagen q represente un cifrado========================================================
          const lockedMessages = response.messages;
          lockedMessages.map((msg) => {
              if(msg.type=="IMAGE"){
              //  console.log("=====imagen=========")
             //   console.log(msg.message)
                msg.message = "images/cryptedImagex.png";
              }

              if(msg.type=="FILE"){
               // console.log("=====file=========")
                //console.log(msg.message)
                msg.message = "images/cryptedImagex.png";
              }

            });

            setMessages(lockedMessages);
        }else{
          //=======================Decifra los mensajes=======================================================
        
            const unlockedMessages = response.messages;

            unlockedMessages.map((msg) => {
      
              if(msg.type=="TEXT"){
   
                msg.message = Decrypt(msg.message,msg.tipo_cifrado, tipo);
   

                if(msg.email_replied != null){
                  msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied, tipo);
                }
              }

               if(msg.type=="IMAGE" || msg.type=="FILE"){
                   // console.log("========imagen or file=======================")
                    msg.message =msg.message;
                    //console.log(msg);
              }
             
            });
          // console.log("Setting messages from server...................")
          console.log("mensajes actualizados...")
           console.log(unlockedMessages);
           
           //setDrop(unlockedMessages.length)
            setMessages(unlockedMessages);
            console.log("setting messages and reload again.....1")
         
          //==============================================================================
        }
       // console.log("::::::::::::::GroupScreen:::::::::::::::::::::::::::");
        unreadMessagesController.setTotalReadMessages(groupId, response.total);

      } catch (error) {
        console.log("error:::::::::::::x");
        console.error(error);
      }
    })();

    return async () => {
      const response = await groupMessageController.getAll(accessToken, groupId );
      unreadMessagesController.setTotalReadMessages(groupId, response.total);
    };
   //=================================================================================
  };


  const updateVistoGrupo = (groupId) => {
     //=================================================================================
     (async () => {
 
       let response = null;
       try {
        
 
         if( statex$.default.isConnected.get() ){
           
           response = await groupMessageController.updateVisto(accessToken, groupId);

         }
        
       } catch (error) {
         console.log("error:::::::::::::");
         console.error(error);
       }
     })();
 
    //=================================================================================
   };

  //==================================================================================================================================================================
  //when newMessage is required, call this instruction
  const newMessage = (msg) => {
   
    (async () => {
      console.log("mensaje por newMessage")
      console.log(msg);
     try {       
          //Get all messages
          if(statex$.default.isConnected.get()){

            //const isMe = (msg.user._id==user._id);

            //let msgOriginal=msg.message;
            if(msg.type=="TEXT"){
        
              msg.message=Decrypt(msg.message, msg.tipo_cifrado, tipo);
        
              if(msg.email_replied != null){
                msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied, tipo);
        
                //find message original and decryp it on message array
                try{
                  console.log("Replicados en newMessage")
                  (messages).map((msgx) => {
        
                    if( Decrypt(msgx.message,msgx.tipo_cifrado, tipo) == msg.message_replied){
                      msgx.message = msg.message_replied;
                    }
                   
                  });
                  setMessages(messages);

                }catch(error){
                  console.log("error al validar xxx")
                }
              }
            }
            //==================================================
              if(statex$.default.cifrado.get()=="SI"){
    
                if(msg.type=="TEXT"){
                  msg.message=Encrypt(msg.message,msg.tipo_cifrado);
                }else{ //img or filr
                  msg.message = "images/cryptedImagex.png";
                }
              }

              setMessages([...messages, msg]);

            console.log("notificando q ya lo leyo el msg: "+ msg._id+" el miembro", user._id, "que esta en el grupo: ", groupId);
            await groupMessageController.notifyRead(
              accessToken,
              user._id,
              groupId
            );

          } 
      } catch (error) {
        console.log("error::::")
        console.log(error)
      }
//==========================================================     
    })();
  };

  const newMessageMe = (msgMe) => {   
    (async () => {
      console.log("========================")
      console.log("========================")
      console.log("mensaje por newMessageMe")
      console.log(msgMe);

     try {
                  
          //Get all messages
          if(statex$.default.isConnected.get()){         

            //const isMe = (msg.user._id==user._id);

           // let msgOriginal=msg.message;
            if(msgMe.type=="TEXT"){
        
              msgMe.message=Decrypt(msgMe.message, msgMe.tipo_cifrado, tipo);
  
              if(msgMe.email_replied != null){
                console.log("Replicados en newMessage_me")
                msgMe.message_replied=Decrypt(msgMe.message_replied,msgMe.tipo_cifrado_replied, tipo);
        
                //find message original and decryp it on message array
                try{
                  (messages).map((msgx) => {
        
                    if( Decrypt(msgx.message,msgx.tipo_cifrado, tipo) == msgMe.message_replied){
                      msgx.message = msgMe.message_replied;
                    }
                   
                  });
                  setMessages(messages);

                }catch(error){
                  console.log("error al validar xxx")
                }
              }
        
              //const isMe = user._id === msg.user._id;
             // console.log("userId who send a message::::",  msg.user._id) 
            }
           
            //==================================================
              if(statex$.default.cifrado.get()=="SI"){
               // setCifradox(true);
                //setCryptMessage(true);
                if(msgMe.type=="TEXT"){
                  msgMe.message=Encrypt(msgMe.message,msgMe.tipo_cifrado);
                }else{ //img or filr
                  msgMe.message = "images/cryptedImagex.png";
                }
              }
            
              
              setMessages([...messages, msgMe]);

              console.log("(owner) notificando q ya leyo msg el miembro", msgMe.user._id, " en el grupo: ", groupId);
              await groupMessageController.notifyRead(
                accessToken,
                msgMe.user._id,
                groupId
              );
          } 

      } catch (error) {
        console.log("error::::")
        console.log(error)
      }
//==========================================================     
   
    })();

  };

  const presentaModal = ()=>{
    console.log("Aplicando llave")
    

    if(user._id === creator._id){
      //console.log("Bienvenido creator del grupo")
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
   
    if(user._id === creator._id){
      //=========================================================================================
       //get all messages of the group
       const respAllMessages = await groupMessageController.getAll(accessToken, groupId);

       const unlockedMessages = respAllMessages.messages;
         //loop group's messages and apply new crypted key, one by one
         unlockedMessages.map(async (msg) => {
     
           if(msg.type=="TEXT"){
             //decrypt message
             msg.message = Decrypt(msg.message, msg.tipo_cifrado)

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