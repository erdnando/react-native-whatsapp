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

const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

export function GroupScreen() {

  const { params: { groupId }, } = useRoute();
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState(null);
  //const [cryptMessage, setCryptMessage] = useState(false);
 

  //EventListener:: unlockMessages
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
                        msg.message = Decrypt(msg.message,msg.tipo_cifrado);
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
                    console.error(error);
                  }
                })();
              } catch (error) {
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
    /*
    //=================================================================================
    (async () => {
      try {
        const cifrados = await authController.getCifrado(); 
     
        const response = await groupMessageController.getAll(accessToken, groupId);

        if(cifrados=="SI"){
          //====================Mantiene cifrados========================================================
          //console.log("GroupScreen:::Mantiene msgs cifrados");
          setMessages(response.messages);
        }else{
          //=======================Decifra los mensajes=======================================================
         // console.log("GroupScreen:::Decifra msgs");
            const unlockedMessages = response.messages;
            unlockedMessages.map((msg) => {
              msg.message = Decrypt(msg.message,msg.tipo_cifrado);
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
   */
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
       // console.log("::::::::::::::GroupScreen:::::::::::::::::::::::::::");
        //console.log("GroupScreen:::Cifrado:::"+cifrados);
        const response = await groupMessageController.getAll(accessToken, groupId);

        if(cifrados=="SI"){
          //====================Mantiene cifrados========================================================
          //console.log("GroupScreen:::Mantiene msgs cifrados");
          setMessages(response.messages);
        }else{
          //=======================Decifra los mensajes=======================================================
         // console.log("GroupScreen:::Decifra msgs");
            const unlockedMessages = response.messages;
            unlockedMessages.map((msg) => {
              msg.message = Decrypt(msg.message,msg.tipo_cifrado);
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
    console.log("new cypher message:::GroupScreen");
    console.log(msg);

    //============Always decifra mensaje======================
    msg.message=Decrypt(msg.message,msg.tipo_cifrado);
    console.log("decifrado");
    console.log(msg);
    //==================================================


   
    (async () => {
      const cifrados = await authController.getCifrado(); 
      console.log("getCifrado new message:::"+cifrados);

      if(cifrados=="SI"){
        //setCryptMessage(true);
        msg.message=Encrypt(msg.message,msg.tipo_cifrado);
      
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
