import { useState, useEffect,useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "native-base";
import { isEmpty } from "lodash";
import { DateTime } from "luxon";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupMessage, UnreadMessages } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, screens, socket } from "../../../../utils";
import { styles } from "./Item.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon } from "native-base";
import { EventRegister } from "react-native-event-listeners";
import * as statex$ from '../../../../state/local';
import { GET_STATE_ALLMESSAGESBYID } from '../../../../hooks/useDA';


const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();


export function Item(props) {

  const { group, upGroupChat } = props;
  const { accessToken, user } = useAuth();
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {

    (async () => {
      try {
        const totalMessages = await groupMessageController.getTotal(
          accessToken,
          group._id
        );
      

        const totalParticipants = await groupMessageController.getGroupParticipantsTotal(
          accessToken,
          group._id
        );
        setTotalMembers(totalParticipants);
        


        const totalReadMessages = await unreadMessagesController.getTotalReadMessages(group._id);
        setTotalUnreadMessages(totalMessages - totalReadMessages);


        //=================================================================
        const eventGrupo = EventRegister.addEventListener("participantsModified", async data=>{
          console.log("group list updated...");
        
              try {
                const totalParticipants = await groupMessageController.getGroupParticipantsTotal(
                  accessToken,
                  group._id
                );
                setTotalMembers(totalParticipants);
                console.log("group and groupResult updated...");
              } catch (error) {
                console.error(error);
              }
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventGrupo);
        }
        
        
        //================================================================

      } catch (error) {
        console.error(error);
      }
    })();
  }, [group._id]);

  //getLastMessage
  useEffect(() => {
    (async () => {
      try {
        const response = await groupMessageController.getLastMessage(accessToken,group._id);
        console.log("===========================");
        console.log(response);
        if (!isEmpty(response)) setLastMessage(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [group._id]);

  //send message to socket IO
  useEffect(() => {
    if(statex$.default.isConnected.get()){
      socket.emit("subscribe", `${group._id}_notify`);
      socket.on("message_notify", newMessage);
    }
  }, []);


//when newMessage is required, call this instruction
  const newMessage = async (newMsg) => {
    //console.log("new cypher message:::item");
   // console.log(newMsg);

    if (newMsg.group === group._id) {
      if (newMsg.user._id !== user._id) {
        upGroupChat(newMsg.group);
        console.log("setting last message");

        
        setLastMessage(newMsg);

        const activeGroupId = await AsyncStorage.getItem(ENV.ACTIVE_GROUP_ID);
        if (activeGroupId !== newMsg.group) {
          setTotalUnreadMessages((prevState) => prevState + 1);
        }
      }
    }
  };

  const  openGroup = async () => {
    console.log("openning group.."+group._id );

    let resAux=null;
    await GET_STATE_ALLMESSAGESBYID(group._id).then(result =>{
          resAux=result.rows._array;
          console.log("datos del grupo", group._id);
          
          console.log(resAux);
          console.log("llave del grupo:"+ group._id + ":::" + resAux[0]?.llave);
          statex$.default.llaveGrupoSelected.set(resAux[0]?.llave)

         
        
      }); 


    
    setTotalUnreadMessages(0);

    navigation.navigate(screens.global.groupScreen, { groupId: group._id, tipo: group.tipo });
  };

  return (
    <TouchableOpacity style={styles.content} onPress={openGroup}>

      {/*Logo del grupo*/}
      <Avatar  bg="cyan.500"
        size="lg"
        marginRight={3}
        style={styles.avatar}
        source={{ uri: `${ENV.BASE_PATH}/group/group1.png` }} 
      />

      <View style={styles.infoContent}>
        <View style={styles.info}>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.messagelista} numberOfLines={2}>
            <Text>
              {lastMessage
                ? `${lastMessage.user.email.substring(0,20) +"... comento"} `
                : ""}
            </Text>
           {/*  <Text style={styles.text}>
              {lastMessage ? lastMessage.message : " "}
            </Text> */}
          </Text>
        </View>

        <View style={styles.notify}>
          {lastMessage ? (
            <Text style={styles.time}>
              {DateTime.fromISO(
                new Date(lastMessage.createdAt).toISOString()
              ).toFormat("HH:mm")}
            </Text>
          ) : null}

          {totalUnreadMessages ? (
            <View style={styles.totalUnreadContent}>
              <Text style={styles.totalUnread}>
                {totalUnreadMessages < 99 ? totalUnreadMessages : 99}
              </Text>
            </View>
          ) : null}

           {/*Icono del tipo de grupo, 1 miembro, varios miembro o cerrado**/}
            <View >
           
              { group?.tipo=="cerrado" ? (
                <Icon
                as={MaterialCommunityIcons}
                name={"key"}
                color={"#646464"}
                size={25}
              />
                ) : totalMembers > 1 ? (
                <Icon
                as={MaterialCommunityIcons}
                name={"account-group"}
                color={"#646464"}
                size={25}
              /> ) :
              <Icon
                as={MaterialCommunityIcons}
                name={"account"}
                color={"#646464"}
                size={25}
              /> 
              
              }
            </View>
          

        </View>


      </View>

    </TouchableOpacity>
  );
}