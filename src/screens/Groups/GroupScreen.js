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
    shouldSetBadge: false,
  }),
});

export function GroupScreen() {

  const navigation = useNavigation();
  const unsubscribe = NetInfo.addEventListener(state => {
   // console.log('Is connected?', state.isConnected);
    statex$.default.isConnected.set(state.isConnected)
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
    // console.log("statex$.default.isConnected.get()")
   //  console.log(statex$.default.isConnected.get())
     
 
        const eventDeletedMessagesupdate = EventRegister.addEventListener("reloadmsgs", async msg=>{
          console.log("Deleting message")
          console.log(msg)
               try {
                
                 (async () => {
                
                 
                   try {
                    statex$.default.moveScroll.set(false);
                     getAllMessages(true);
                     /*let grupoAsociado='';

                     (messages).map((msgx) => {

                       if(msgx._id == idMsg){
                         grupoAsociado = msgx.group
                       }
                     
                      });

                      if(grupoAsociado!='') updateVistoGrupo(grupoAsociado);
                     */
                     // statex$.default.moveScroll.set(false);
                      
                     // setMessages(messages)
                   

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






    //EventListener:: decifra mensajes
    useEffect(() => {
     // console.log("statex$.default.isConnected.get()")
    //  console.log(statex$.default.isConnected.get())
      
  
         const eventReloadMessages = EventRegister.addEventListener("idMessagevisto", async idMsg=>{
           
                try {
                 
                  (async () => {
                  //  console.log("reloadMessagesSeen:::");
                  
                    try {
                     
                      //TODO Update Read status of the messages by group
                     
                      getAllMessages(true);
                      let grupoAsociado='';

                      (messages).map((msgx) => {
                       // console.log("buscando el grupo del msg")
                        //console.log(msgx)
                        if(msgx._id == idMsg){
                          grupoAsociado = msgx.group
                        }
                      
                       });

                       if(grupoAsociado!='') updateVistoGrupo(grupoAsociado);
                      // getAllMessages(true);

/*
                     (messages).map((msgx) => {
                      console.log("buscando el grupo del msg")
                      console.log(msgx)
                      if(msgx._id == idMsg){
                        grupoAsociado = msgx.group
                      }
                    
                     });


                      (messages).map((msgx) => {
                        console.log("actualizando estatus de leido")
                        if(msgx.group == grupoAsociado){
                          msgx.estatus="LEIDO";
                        }
                       
                       });*/

                       //console.log("messages")
                       //console.log(messages)
                       
                       setMessages(messages)
                       //setDrop('');

                    } catch (error) {
                      console.log("Error")
                      console.error(error);
                    }
                  })();
                } catch (error) {
                  console.log("Error 3")
                  console.error(error);
                }
          });
      
          return ()=>{
            EventRegister.removeEventListener(eventReloadMessages);
          }
    }, [messages]);


  //EventListener:: decifra mensajes
  useEffect(() => {
    //console.log("statex$.default.isConnected.get()")
    //console.log(statex$.default.isConnected.get())
    

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

  useEffect(() => {
   // console.log("statex$.default.isConnected.get()")
   // console.log(statex$.default.isConnected.get())
    

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
   // console.log("statex$.default.isConnected.get()")
    //console.log(statex$.default.isConnected.get())
    

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
    
   getAllMessages(false);

  }, [groupId]);


  //EventListener:deletingMessage for me
  useEffect(() => {

      try {
        
         //=================================================================
         const eventDeleteMessageForMe = EventRegister.addEventListener("deletingMessageForMe", async data=>{
          
          //console.log("Deleteing for me message")
         // console.log("message._id:"+data._id);
         // console.log("message.message:"+data.message);
         // console.log("message.group:"+data.group);
         // console.log("message.tipo_cifrado:"+data.tipo_cifrado);
         // console.log("message.type:"+data.type);
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
  }, []);

  //subscribe sockets
  {/*new message socket listener*/}
  {/*reload socket listener*/}
  useEffect(() => {

    socket.emit("subscribe", groupId);
    socket.on("reloadmsgs", reloadmsgs);
   // if(statex$.default.isConnected.get()){
      

     // socket.emit("subscribe", groupId);
     
     // socket.on("reloadmsgs", getAllMessages);

      return () => {
        socket.emit("unsubscribe", groupId);
       // socket.off("message", newMessage);
        socket.off("reloadmsgs", reloadmsgs);
      };
    //}

  }, [groupId, messages]);



  const reloadmsgs = async (msg)=>{

   
          
    if( statex$.default.lastPushNotification.get() !=  msg.message){
    
      console.log("reloading....");
      console.log(msg);
      
      if(groupId== msg.group_id){
        statex$.default.moveScroll.set(true);
        getAllMessages(true);

        setMessages(messages)
      }
      
    
       
      
      statex$.default.lastPushNotification.set(msg.message);

    }

  }
  /*const  recuperaMensajesDB= async(groupId)  =>{

    console.log("recupuera mesgs from db2");

  
        let resAux=null;
        await GET_STATE_ALLMESSAGESBYID(groupId).then(result =>{
              resAux=result.rows._array;
              console.log("recuperaMensajesDB 3");
              console.log(resAux);

              setMessages( resAux[0]?.valor?.messages);
      });


   

  }*/
//==================================================================================================================================================================
  //get all messages
  const getAllMessages = (visto) => {
   // console.log("reloading message:::GroupScreen");
    //=================================================================================
    (async () => {

      let response = null;
      try {
        let cifrados = statex$.default.cifrado.get();//await authController.getCifrado(); 
       // console.log("cifrados");
       // console.log(statex$.default.cifrado.get());

        if( statex$.default.isConnected.get() ){
          
          //console.log("online, getting from internet db")
          response = await groupMessageController.getAll(accessToken, groupId);

          console.log("mensajes en el server del grupo.............." + groupId)
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
       

       // console.log("despues de la consulta")
        //console.log(response)

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
      
             // if(visto==true)msg.estatus="LEIDO";

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
                    //console.log(msg);
              }
             
            });
           console.log("Setting messages from server...................")
           console.log(unlockedMessages)
           //setMessages([]);
            setMessages(unlockedMessages);
         
          //==============================================================================
        }
       // console.log("::::::::::::::GroupScreen:::::::::::::::::::::::::::");
        unreadMessagesController.setTotalReadMessages(groupId, response.total);

      } catch (error) {
        console.log("error:::::::::::::");
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
    // console.log("reloading message:::GroupScreen");
     //=================================================================================
     (async () => {
 
       let response = null;
       try {
        
 
         if( statex$.default.isConnected.get() ){
           
          // console.log("calling VISTO api")
           response = await groupMessageController.updateVisto(accessToken, groupId);

         }
 
         //console.log("despues de la consulta")
         //console.log(response)
        
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

     // console.log("messages::::::::::::::::::::::")
     // console.log(messages)
    //  console.log("identificando nuevo mensaje en GroupScreen:::::")
     // console.log(msg);

     try {
                  
          //Get all messages
          if(statex$.default.isConnected.get()){


            const totalParticipants = await groupMessageController.getGroupParticipantsTotal( accessToken, groupId );
           // console.log("totalParticipants")
           // console.log(totalParticipants)
            //if(totalParticipants==1)msg.estatus="LEIDO";

            //TODO: notifying user who send the message that it has been read
            //Por q estoy dentro del chat e inmediatamente hay q avisarle que ya se leyo
             // console.log("notificando que su mensaje ha sido recibido en newMessage en GroupScreen:")
             // console.log( statex$.default.userWhoSendMessage.get())

             console.log("notificando q ya lo leyo el msg: "+ msg._id+" el miembro", user._id, "que esta en el grupo: ", groupId);
            await groupMessageController.notifyRead(
              accessToken,
              user._id,
              msg._id,
              groupId
            );

            const isMe = (msg.user._id==user._id);

            if(!isMe){


            

              // console.log("preparando envio de leido")
              //  const msgOrigen={
             //     idUser: user._id,
              //    idMsg: msg._id,
              //  }
                             
              // if(totalParticipants>1){
                /*await groupMessageController.notifyRead(
                  accessToken,
                  user._id,
                  msg._id,
                );*/
              // }
               
              // statex$.default.userWhoSendMessage.set(msgOrigen);
            }
            /*else{
              if(totalParticipants==1){
                await groupMessageController.notifyRead(
                  accessToken,
                  msg.user._id,
                  msg._id
                );
               }
            }*/

            let msgOriginal=msg.message;
            if(msg.type=="TEXT"){
        
              msg.message=Decrypt(msg.message, msg.tipo_cifrado, tipo);
        
              if(msg.email_replied != null){
                msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied, tipo);
        
                //find message original and decryp it on message array
                try{
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
               // setCifradox(true);
                //setCryptMessage(true);
                if(msg.type=="TEXT"){
                  msg.message=Encrypt(msg.message,msg.tipo_cifrado);
                }else{ //img or filr
                  msg.message = "images/cryptedImagex.png";
                }
              }
           //   console.log("messages decifrados:::::::::::::::::::::::::::::::::::::::::::::::::::::::::;");
            //  console.log(messages);
        
              
              setMessages([...messages, msg]);
          } 

      } catch (error) {
        console.log("error::::")
        console.log(error)
      }
//==========================================================     
   
    })();

  };

  const newMessageMe = (msg) => {
   
    (async () => {
      console.log("mensaje por newMessageMe")
      console.log(msg);

     try {
                  
          //Get all messages
          if(statex$.default.isConnected.get()){


            const totalParticipants = await groupMessageController.getGroupParticipantsTotal( accessToken, groupId );
            //console.log("totalParticipants")
           // console.log(totalParticipants)
           // if(totalParticipants==1)msg.estatus="LEIDO";

            console.log("(owner )notificando q ya lo leyo el msg: "+ msg._id+" el miembro", msg.user._id, "que esta en el grupo: ", groupId);
            await groupMessageController.notifyRead(
              accessToken,
              msg.user._id,
              msg._id,
              groupId
            );

             // console.log("notificando que su mensaje ha sido recibido en newMessage en GroupScreen:")

            const isMe = (msg.user._id==user._id);

           /* if(!isMe){
              // console.log("preparando envio de leido")
                const msgOrigen={
                  idUser: msg.user._id,
                  idMsg: msg._id,
                }
                             
               if(totalParticipants>1){
                await groupMessageController.notifyRead(
                  accessToken,
                  msg.user._id,
                  msg._id
                );
               }
               
              // statex$.default.userWhoSendMessage.set(msgOrigen);
            }else{
              if(totalParticipants==1){
                await groupMessageController.notifyRead(
                  accessToken,
                  msg.user._id,
                  msg._id
                );
               }
            }*/

            let msgOriginal=msg.message;
            if(msg.type=="TEXT"){
        
              msg.message=Decrypt(msg.message, msg.tipo_cifrado, tipo);
             // console.log("msg.message decifrado::::");
             // console.log(msg.message);
        
              if(msg.email_replied != null){
                //console.log("Entro a email_replied.....????")
                msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied, tipo);
        
                //find message original and decryp it on message array
                try{
                  (messages).map((msgx) => {
        
                    if( Decrypt(msgx.message,msgx.tipo_cifrado, tipo) == msg.message_replied){
                      msgx.message = msg.message_replied;
                    }
                   
                  });
                  setMessages(messages);

                 // console.log("messages 4");
                 // console.log(messagesx);
                }catch(error){
                  console.log("error al validar xxx")
                }
              }
        
              const isMe = user._id === msg.user._id;
             // console.log("userId who send a message::::",  msg.user._id) 
            }
           
            //==================================================
              if(statex$.default.cifrado.get()=="SI"){
               // setCifradox(true);
                //setCryptMessage(true);
                if(msg.type=="TEXT"){
                  msg.message=Encrypt(msg.message,msg.tipo_cifrado);
                }else{ //img or filr
                  msg.message = "images/cryptedImagex.png";
                }
              }
             // console.log("messages decifrados:::::::::::::::::::::::::::::::::::::::::::::::::::::::::;");
             // console.log(messages);
        
              
              setMessages([...messages, msg]);

              //console.log("messages al final:::::::::::::::::::::::::::::::::::::::::::::::::::::::::;");
            //  console.log(messages);
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
    

   // console.log("Datos")

   // console.log("llave actual")
   // console.log(statex$.default.llaveGrupoSelected.get())
   // console.log('user._id')
   // console.log(user._id)
  //  console.log("groupId")
   // console.log(groupId)
   // console.log("creator._id")
   // console.log(creator._id)

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

   // console.log("Aplicando llave")
   // console.log("Datos")
    //console.log("llave actual")
    //console.log(statex$.default.llaveGrupoSelected.get())
    //console.log('user._id')
   // console.log(user._id)
   // console.log("groupId")
    //console.log(groupId)
   // console.log("creator._id")
   // console.log(creator._id)
   
    if(user._id === creator._id){
      //=========================================================================================
       //get all messages of the group
       const respAllMessages = await groupMessageController.getAll(accessToken, groupId);

       //console.log("decifrando con llave vieja")
       //console.log(statex$.default.llaveGrupoSelected.get())

       const unlockedMessages = respAllMessages.messages;
         //loop group's messages and apply new crypted key, one by one
         unlockedMessages.map(async (msg) => {
     
           if(msg.type=="TEXT"){
             //decrypt message
             msg.message = Decrypt(msg.message, msg.tipo_cifrado)
            // console.log("mensaje decifrado")
            // console.log(msg.message)
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