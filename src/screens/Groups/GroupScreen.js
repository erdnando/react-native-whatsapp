import { useState, useEffect } from "react";
import { View } from "native-base";
import { useRoute } from "@react-navigation/native";
import { GroupMessage, UnreadMessages,Auth } from "../../api";
import { useAuth } from "../../hooks";
import { HeaderGroup } from "../../components/Navigation";
import { LoadingScreen } from "../../components/Shared";
import { ListMessages, GroupForm } from "../../components/Group";
import { ENV, socket,Decrypt,Encrypt } from "../../utils";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import * as statex$ from '../../state/local.js'

const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

export function GroupScreen() {

  const { params: { groupId }, } = useRoute();
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState(null);
 

  //EventListener:: decifra mensajes
  useEffect(() => {
    //console.log("groupId:::::::::::::::::::::::::::::::::::")
    //console.log(groupId)
  
      //ok revisado
       const eventMessages = EventRegister.addEventListener("setCifrado", async isCypher=>{
         
              try {
              
               // (async () => {
                  console.log("cifrado candadito:"+ isCypher);
                  //setCryptMessage(data);
                  //await authController.setCifrado(isCypher);
                  statex$.default.flags.cifrado.set(isCypher);

                  try {
                   // const response = await groupMessageController.getAll(accessToken, groupId);
                   //recupero msg del grupo seleccionado
                    const response = await groupMessageController.getAllLocal(groupId);
                    console.log(" con mensajes cifrados del grupo")
                    console.log(response)

                   //==========================================
                    const unlockedMessages = response.messages;
                    //console.log(unlockedMessages);

                    if(isCypher=="NO"){
                      // console.log("decifrando mensajes");
                        unlockedMessages.map((msg) => {
                         
                          if(msg.type=="TEXT"){
                              console.log("decifrando")
                              console.log(msg.message)
                              console.log("con")
                              console.log(msg.tipo_cifrado)

                              msg.message = Decrypt(msg.message, msg.tipo_cifrado);
                              console.log("asi quedo:::")
                              console.log(msg.message)
                              
                              if(msg.email_replied != null){ 
                                msg.message_replied= Decrypt(msg.message_replied,msg.tipo_cifrado_replied);
                              }

                          
                          }
                        
                        });

                    }else{
                        unlockedMessages.map((msg) => {
                          /*if(msg.type=="TEXT"){
                            msg.message = Encrypt(msg.message, msg.tipo_cifrado);
                          }*/
                          if(msg.type=="IMAGE"){
                            msg.message = "images/cryptedImagex.png";
                          }
                          if(msg.type=="FILE"){
                            msg.message = "images/cryptedImagex.png";
                          }
                        
                        });

                    }
                  
                    //==========================================
                    //console.log("setting mensajes");
                    //console.log(unlockedMessages);
                   // console.log("===============================");
                   // setMessages(unlockedMessages);

                   setMessages([]);
                    setMessages( unlockedMessages);

                    console.log("unlockedMessages")
                    console.log(unlockedMessages)
                    unreadMessagesController.setTotalReadMessages(groupId, response.total);

                  } catch (error) {
                    console.log("Error 1")
                    console.error(error);
                  }
               // })();
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
      await AsyncStorage.setItem(ENV.ACTIVE_GROUP_ID,groupId.toString());
    })();

    return async () => {
      await AsyncStorage.removeItem(ENV.ACTIVE_GROUP_ID);
    };
  }, []);

  //Get messages
  useEffect(() => {
    
   getAllMessages();

  }, [groupId]);

  //subscribe sockets
  useEffect(() => {
    socket.emit("subscribe", groupId.toString());
    //console.log("subscrito al grupo"+ groupId)
    //socket.on("message", newMessage);
    socket.on("message", newMessageLocal);
    socket.on("reloadmsgs", getAllMessages);
    socket.on("editAndReloadmsgs", editAndReloadmsgs);
    

    return () => {
      socket.emit("unsubscribe", groupId.toString());
      //socket.off("message", newMessage);
      socket.off("message", newMessageLocal);
      socket.off("reloadmsgs", getAllMessages);
      socket.off("editAndReloadmsgs", editAndReloadmsgs);
    };
  }, [groupId,messages]); 


//=================================================================================================================================================

  //editAndReloadmsgs
  const editAndReloadmsgs = (msgEdited) => {
   
    //console.log("editing and reloading message:::GroupScreen");
    //params:  { group_id,idMessage,message,tipo_cifrado } 
      console.log("editAndReloadmsgs::::::::::::::::::::::::::::::::::");

      const arrGpoMessages = statex$.default.groupmessages.get();
    
      const arrEditedGpoMessages = arrGpoMessages.map(gm => {
        if (gm._id == msgEdited.idMessage) {
            return { ...gm, message: msgEdited.message };
        }
        return gm;
      });

      
      //setting edited array
      statex$.default.groupmessages.set(arrEditedGpoMessages);
      //=================================================================================


      (async () => {
        try {
          const cifrado = statex$.default.flags.cifrado.get();
        
          console.log("cifrado");
          console.log(cifrado);
  
          const response = await groupMessageController.getAllLocal(groupId.toString());
          console.log("response all messages::::::::::::::::::")
          console.log(response)
  
          
  
          if(cifrado=="SI"){
            //====================Mantiene cifrados los TXT y coloca imagen q represente un cifrado========================================================
            const lockedMessages = response.messages;

            lockedMessages.map((msg) => {
                if(msg.type=="IMAGE"){
                  msg.message = "images/cryptedImagex.png";
                }
  
                if(msg.type=="FILE"){
                  msg.message = "images/cryptedImagex.png";
                }
  
              });
              setMessages(lockedMessages);
          }else{
            //=======================Decifra los mensajes=======================================================
          
              const unlockedMessages = response.messages;
            
              unlockedMessages.map((msg) => {
        
                if(msg.type=="TEXT"){
                 
                  msg.message = Decrypt(msg.message,msg.tipo_cifrado);

                  if(msg.email_replied != null){
                    msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied);
                  }
                }
               
              });
  
              setMessages([]);
              setMessages(unlockedMessages);
             
             
              const { sound } = await Audio.Sound.createAsync( require('../../assets/newmsg.wav'));//'../../assets/newmsg.wav'
              await sound.playAsync();
              
             
            //==============================================================================
          }
         // console.log("::::::::::::::GroupScreen:::::::::::::::::::::::::::");
          unreadMessagesController.setTotalReadMessages(groupId.toString(), response.total);
  
         
        } catch (error) {
          console.error(error);
        }
      })();
  
      return async () => {
        const response = await groupMessageController.getAllLocal(groupId.toString());
  
        unreadMessagesController.setTotalReadMessages(groupId.toString(), response.total);
      };
     
    };

  //get all messages
  const getAllMessages = () => {
  //console.log("reloading message:::GroupScreen");
    console.log("getAllMessages::::::::::::::::::::::::::::::::::");

  
    //=================================================================================
    (async () => {
      try {
        //const cifrados = await authController.getCifrado(); 
        const cifrado = statex$.default.flags.cifrado.get();
      
        console.log("cifrado");
        console.log(cifrado);

        //const response = await groupMessageController.getAll(accessToken, groupId.toString());
        const response = await groupMessageController.getAllLocal(groupId.toString());
        console.log("response all messages::::::::::::::::::")
        console.log(response)

        

        if(cifrado=="SI"){
          //====================Mantiene cifrados los TXT y coloca imagen q represente un cifrado========================================================
          const lockedMessages = response.messages;
          lockedMessages.map((msg) => {
              if(msg.type=="IMAGE"){
                //console.log("=====imagen=========")
                //console.log(msg.message)
                msg.message = "images/cryptedImagex.png";
              }

              if(msg.type=="FILE"){
                //console.log("=====file=========")
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
                msg.message = Decrypt(msg.message,msg.tipo_cifrado);

                if(msg.email_replied != null){
                  msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied);
                }
              }
             
            });

            setMessages([]);
            setMessages(unlockedMessages);

           
            const { sound } = await Audio.Sound.createAsync( require('../../assets/newmsg.wav'));//'../../assets/newmsg.wav'
            await sound.playAsync();
            /*try {
              await sound.playAsync();
            } catch (error) {
              console.log(error)
            }*/
           
          //==============================================================================
        }
       // console.log("::::::::::::::GroupScreen:::::::::::::::::::::::::::");
        unreadMessagesController.setTotalReadMessages(groupId.toString(), response.total);

       



      } catch (error) {
        console.error(error);
      }
    })();

    return async () => {
     // const response = await groupMessageController.getAll(accessToken, groupId.toString() 
      const response = await groupMessageController.getAllLocal(groupId.toString());

      unreadMessagesController.setTotalReadMessages(groupId.toString(), response.total);
    };
   
  };

  //when newMessage is required, call this instruction
  const newMessageLocal = (msgNew) => {
   
    console.log("2.-receiving crypted message....");
    console.log(msgNew);
    console.log("=========================================");

    (async () => {
      const arrMessageGrupo = statex$.default.groupmessages.get();
      //agregando nuevo msg
      statex$.default.groupmessages.set((arrMessageGrupo) => [...arrMessageGrupo, msgNew]);
      console.log("3.-adding as it is, to state groupmessages....");

      let msg = { ...msgNew }
     
      //console.log("identificando nuevo local mensaje:::::")
      //console.log("===========================================")
      //console.log(msg);
      //console.log("===========================================")
      //============Always decifra mensaje======================
    

      if(msg.type=="TEXT"){



          msg.message=Decrypt(msg.message, msg.tipo_cifrado);


            if(msg.email_replied != null){
                console.log("entro a message replied section")
                msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied);

                //find message original and decryp it on message array
                try{
                  messages.map((msgx) => {
                      if( Decrypt(msgx.message,msgx.tipo_cifrado) == msg.message_replied){
                          msgx.message = msg.message_replied;
                      }
                  });
                  setMessages(messages);
                }catch(error){
                  console.log("error al validar xxx local")
                }
            }
            //here  sound
            const { sound } = await Audio.Sound.createAsync( require('../../assets/newmsg.wav'));
            await sound.playAsync();
      }

      //const cifrados = await authController.getCifrado(); 
      const cifrado = statex$.default.flags.cifrado.get();
     
      if(cifrado=="SI"){
        //setCryptMessage(true);
        if(msg.type=="TEXT"){
          msg.message=Encrypt(msg.message.toString(), msg.tipo_cifrado);
        }else{ //img or filr
          msg.message = "images/cryptedImagex.png";
        }
      }

     
      setMessages([...messages, msg]);

     
    })();


   
  };

  /*const newMessage = (msg) => {
   
    (async () => {

    console.log("identificando nuevo mensaje:::::")
    console.log("===========================================")
    console.log(msg);
    console.log("===========================================")
    //============Always decifra mensaje======================
  
    if(msg.type=="TEXT"){
      msg.message=Decrypt(msg.message, msg.tipo_cifrado);

      if(msg.email_replied != null){
        msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied);

        //find message original and decryp it on message array
        try{
          messages.map((msgx) => {
            //console.log("=====================")
            //console.log(msgx.message)
            //console.log(msg.message_replied)
            //console.log("=====================")
            if( Decrypt(msgx.message,msgx.tipo_cifrado) == msg.message_replied){
              msgx.message = msg.message_replied;
            }
           
          });
          setMessages(messages);//no
        }catch(error){
          console.log("error al validar xxx")
        }
        

      }
      //here  sound
      const { sound } = await Audio.Sound.createAsync( require('../../assets/newmsg.wav'));
      await sound.playAsync();
      
    }
   
    //==================================================

      const cifrados = await authController.getCifrado(); 

      if(cifrados=="SI"){
        //setCryptMessage(true);
        if(msg.type=="TEXT"){
          console.log("cifrando 5")
          msg.message=Encrypt(msg.message,msg.tipo_cifrado);
        }else{ //img or filr
          msg.message = "images/cryptedImagex.png";
        }
      }
     
      setMessages([...messages, msg]);//no

     
    })();


   
  };*/

  if (!messages) return <LoadingScreen />;

  

  return (
    <>
      <HeaderGroup groupId={groupId.toString()} />

      <View style={{ flex: 1 }}>
        <ListMessages messages={messages} />
        <GroupForm groupId={groupId.toString()} />
      </View>

    </>
  );
}
