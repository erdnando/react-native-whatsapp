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
  const [cryptMessage, setCryptMessage] = useState(false);
 

  useEffect(() => {
  
       const eventMessages = EventRegister.addEventListener("unlockMessages", async data=>{
         
              try {
               
                console.log("Desbloqueando mensajes..."+ data);
                setCryptMessage(data);

            
                  await authController.setCifrado(data==true ? "NO" : "NO");

                (async () => {
                  try {
                    const response = await groupMessageController.getAll(accessToken, groupId);
                   //==========================================
                    const unlockedMessages = response.messages;

                    if(data){
                      unlockedMessages.map((msg) => {
                        msg.message = Decrypt(msg.message,msg.tipo_cifrado);
                      });
                    }
                  
                    //==========================================
                    setMessages(unlockedMessages);
   
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

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(ENV.ACTIVE_GROUP_ID, groupId);
    })();

    return async () => {
      await AsyncStorage.removeItem(ENV.ACTIVE_GROUP_ID);
    };
  }, []);

  useEffect(() => {
    //=================================================================================
    (async () => {
      try {
        const cifrados = await authController.getCifrado(); 
        console.log("getCifrado useEffect:::"+cifrados);
        const response = await groupMessageController.getAll(accessToken, groupId);

        if(cifrados=="SI"){
          //====================Mantiene cifrados========================================================
          setMessages(response.messages);
        }else{
          //=======================Decifra los mensajes=======================================================
            const unlockedMessages = response.messages;
            unlockedMessages.map((msg) => {
              msg.message = Decrypt(msg.message,msg.tipo_cifrado);
            });

            setMessages(unlockedMessages);
          //==============================================================================
        }
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

  }, [groupId]);

  useEffect(() => {
    socket.emit("subscribe", groupId);
    socket.on("message", newMessage);

    return () => {
      socket.emit("unsubscribe", groupId);
      socket.off("message", newMessage);
    };
  }, [groupId, messages]);



  const newMessage = (msg) => {
    console.log("enviando nuevo msg...");
    console.log(msg);

    //============Decifra mensaje======================
    msg.message=Decrypt(msg.message,msg.tipo_cifrado);
    console.log("decifrado");
    console.log(msg);
    //==================================================


   
    (async () => {
      const cifrados = await authController.getCifrado(); 
      console.log("getCifrado new message:::"+cifrados);

      if(cifrados=="SI"){
        setCryptMessage(true);
        msg.message=Encrypt(msg.message,msg.tipo_cifrado);
      
      }else{
        setCryptMessage(false);
        //msg.message=Decrypt(msg.message,msg.tipo_cifrado);
      
      }


      /*if(cryptMessage){
        msg.message=Decrypt(msg.message,msg.tipo_cifrado);
      }*/
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
