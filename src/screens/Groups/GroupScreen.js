import { useState, useEffect } from "react";
import { View } from "native-base";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupMessage, UnreadMessages } from "../../api";
import { useAuth } from "../../hooks";
import { HeaderGroup } from "../../components/Navigation";
import { LoadingScreen } from "../../components/Shared";
import { ListMessages, GroupForm } from "../../components/Group";
import { ENV, socket,Decrypt } from "../../utils";
import { EventRegister } from "react-native-event-listeners";

const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();

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
                (async () => {
                  try {
                    const response = await groupMessageController.getAll(
                      accessToken,
                      groupId
                    );
                   
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
    (async () => {
      try {
        const response = await groupMessageController.getAll(
          accessToken,
          groupId
        );
        setMessages(response.messages);
        unreadMessagesController.setTotalReadMessages(groupId, response.total);
      } catch (error) {
        console.error(error);
      }
    })();

    return async () => {
      const response = await groupMessageController.getAll(
        accessToken,
        groupId
      );
      unreadMessagesController.setTotalReadMessages(groupId, response.total);
    };
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
    if(cryptMessage){
      msg.message=Decrypt(msg.message,msg.tipo_cifrado);
    }
    setMessages([...messages, msg]);
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
