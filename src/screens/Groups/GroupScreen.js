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

const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

export function GroupScreen() {

  const { params: { groupId }, } = useRoute();
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState(null);
 

  //EventListener:: decifra mensajes
  useEffect(() => {
  
       const eventMessages = EventRegister.addEventListener("setCifrado", async isCypher=>{
         
              try {
               
                (async () => {
                  console.log("setCifrado por evento:::"+ isCypher);
                  //setCryptMessage(data);
                  await authController.setCifrado(isCypher);

                  try {
                    const response = await groupMessageController.getAll(accessToken, groupId);
                   //==========================================
                    const unlockedMessages = response.messages;
                    //console.log(unlockedMessages);

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
        const response = await groupMessageController.getAll(accessToken, groupId);

        console.log("mensajes del grupo")
        console.log(response)

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
                msg.message = Decrypt(msg.message,msg.tipo_cifrado);
                console.log("========texto=======================")
                console.log(msg);

                if(msg.email_replied != null){
                  msg.message_replied=Decrypt(msg.message_replied,msg.tipo_cifrado_replied);
                }
              }

               if(msg.type=="IMAGE" || msg.type=="FILE"){
                    console.log("========imagen or file=======================")
                    msg.message =msg.message;
                    console.log(msg);
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
      const response = await groupMessageController.getAll(accessToken, groupId );
      unreadMessagesController.setTotalReadMessages(groupId, response.total);
    };
   //=================================================================================


  
  };

  //when newMessage is required, call this instruction
  const newMessage = (msg) => {
   
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
    /*if(msg.type=="FILE"){
      msg.message = "images/cryptedImagex.png";
    }*/
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
     
      setMessages([...messages, msg]);

     
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