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
import * as statex$ from '../../state/local'

const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

export function GroupScreen() {

  //const { params: { groupId }, } = useRoute();
  const { accessToken, email } = useAuth();
  const [messages, setMessages] = useState(null);
  const groupId = statex$.default.grupoId.get();



  //EventListener:: reload msgs
  useEffect(() => {
  
    const eventReloadMessages = EventRegister.addEventListener("reloadMessages", async data=>{
      
      getAllMessages();
         
     });
 
     return ()=>{
       EventRegister.removeEventListener(eventReloadMessages);
     }
     
}, []);



  //EventListener:: decifra mensajes
  useEffect(() => {
  
       const eventMessages = EventRegister.addEventListener("setCifrado", async isCypher=>{
         
              try {
               
                (async () => {
                  console.log("setCifrado por evento:::"+ isCypher);
                  //setCryptMessage(data);
                  await authController.setCifrado(isCypher);

                  try {
                    //get All Messgages of a Group
                    console.log('getAll===========origin')
                    console.log("groupId")
                    console.log(groupId)
                    const response = await groupMessageController.getAllLocalDB(groupId);//offline support!
                   //==========================================
                    const unlockedMessages = response.messages;
                    console.log("isCypher")
                    console.log(isCypher)
                    console.log("unlockedMessages")
                    console.log(unlockedMessages)
                   
                    if(isCypher=="NO"){
                     // console.log("decifrando mensajes");
                      unlockedMessages.map((msg) => {
                        if(msg.type=="TEXT"){
                            msg.message = Decrypt(msg.message,msg.tipo_cifrado);
                            
                            if(msg.email_replied != null){
                              msg.message_replied= Decrypt(msg.message_replied,msg.tipo_cifrado_replied);
                            }
                        }
                       
                      });
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

  //subscribe sockets
  useEffect(() => {

    socket.emit("subscribe", groupId);
    socket.on("message", newMessage);
    socket.on("reloadmsgs", getAllMessages);
      
    return () => {

      socket.emit("unsubscribe", groupId);
      socket.off("message", newMessage);
      socket.off("reloadmsgs", getAllMessages);
      
    };
  }, [groupId, messages]);




  //get all messages
  const getAllMessages = () => {

    console.log("reloading message:::GroupScreen");
    //=================================================================================
    (async () => {
      try {
        const cifrados = await authController.getCifrado(); 
        console.log("cifrados");
        console.log(cifrados);

        console.log("groupId")
        console.log(groupId)
        const response = await groupMessageController.getAllLocalDB(groupId);

        if(cifrados=="SI"){
          //====================Mantiene cifrados los TXT y coloca imagen q represente un cifrado========================================================
          let lockedMessages = response.messages;
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

            setMessages([]);
            setMessages(lockedMessages);
        }else{
          //=======================Decifra los mensajes=======================================================
        
            let unlockedMessages = response.messages;

            unlockedMessages.map((msg) => {
      
              if(msg.type=="TEXT"){
                msg.message = Decrypt(msg.message,msg.tipo_cifrado);

                if(msg.email_replied != null){
                  msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied);
                }
              }
              /*else if(msg.type=="FILE"){
                console.log("========file=======================")
                msg.message = "images/cryptedImagex.png";
                console.log(msg.message);
              }*/
              /*else{
                console.log("========imagen=======================")
                console.log(msg.message);
              }*/
            });
            setMessages([]);
            setMessages(unlockedMessages);

           

            //here  sound because edited it
            console.log("playing audio................newmsg1");

            

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
        unreadMessagesController.setTotalReadMessages(groupId, response.total);

       



      } catch (error) {
        console.error(error);
      }
    })();

    return async () => {
      const response = await groupMessageController.getAllLocalDB(groupId );
      unreadMessagesController.setTotalReadMessages(groupId, response.total);
    };
   //=================================================================================


  
  };

  //when newMessage is required, call this instruction
  const newMessage = (newMsgx) => {
   
    (async () => {

    console.log("identificando nuevo mensaje:::::")
    console.log("===========================================")
    console.log(newMsgx);
    console.log("===========================================")
    //============Always decifra mensaje======================

    //adding to global state
    const arrMessagesRef =statex$.default.messages.get();
    statex$.default.messages.set((arrMessagesRef) => [...arrMessagesRef, newMsgx]);
   
    //adding to local db
    groupMessageController.guardaMessage(newMsgx)

     
    let newMsg = { ...newMsgx };

    if(newMsg.type=="TEXT"){
      const cifrados = await authController.getCifrado(); 
      if(cifrados=="NO"){
        newMsg.message=Decrypt(newMsg.message,newMsg.tipo_cifrado);
      }

      //============================================================================
      if(newMsg.email_replied != null){
        newMsg.message_replied=Decrypt(newMsg.message_replied,newMsg.tipo_cifrado_replied);

        //find message original and decryp it on message array
        try{
          messages.map((msgx) => {
            if( Decrypt(msgx.message,msgx.tipo_cifrado) == newMsg.message_replied){
              msgx.message = newMsg.message_replied;
            }
           
          });
          setMessages(messages);
        }catch(error){
          console.log("error al validar msg replied")
        }
      }
      //============================================================================


      
    }
      //ading to local state
    setMessages([...messages, newMsg]);

    //here  sound
    const { sound } = await Audio.Sound.createAsync( require('../../assets/newmsg.wav'));
    await sound.playAsync();
  //=================================================================
  /*let newMsg = { ...newMsgx }
  
    if(newMsg.type=="TEXT"){
      console.log("decifrando..")
      newMsg.message=Decrypt(newMsg.message, newMsg.tipo_cifrado);
      console.log(newMsg.message)

      if(newMsg.email_replied != null){
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
          console.log("error al validar xxx")
        }
        

      }
      //here  sound
      const { sound } = await Audio.Sound.createAsync( require('../../assets/newmsg.wav'));
      await sound.playAsync();
      
    }
   

      const cifrados = await authController.getCifrado(); 

      if(cifrados=="SI"){
        if(newMsg.type=="TEXT"){

          console.log("cifrando antes de persistir en state!!!!!!!!")
          console.log("cifrando 7")
          newMsg.message=Encrypt(newMsg.message,newMsg.tipo_cifrado);
          console.log("newMsg:::::::")
          console.log(newMsg)

        }else{ //img or filr
          newMsg.message = "images/cryptedImagex.png";
        }
      }
      */
    
    })();


   
  };

  if (!messages) return <LoadingScreen />;

  

  return (
    <>
      <HeaderGroup groupId={groupId} />

      <View style={{ flex: 1 }}>
        <ListMessages messages={messages} />
        <GroupForm groupId={groupId} />
      </View>

    </>
  );
}