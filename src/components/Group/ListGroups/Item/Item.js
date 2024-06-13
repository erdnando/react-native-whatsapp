import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { Avatar } from "native-base";
import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupMessage, UnreadMessages,Auth } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, screens, socket } from "../../../../utils";
import { styles } from "./Item.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon } from "native-base";
import { EventRegister } from "react-native-event-listeners";
import * as statex$ from '../../../../state/local';
import { GET_STATE_GROUP_LLAVE, ADD_STATE_GROUP_LLAVE, DELETE_STATE_GROUP_LLAVE_BY_ID } from '../../../../hooks/useDA';
import * as Notifications from 'expo-notifications';


//====================PUSH NOTIFICATIONS=================================================================================

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//=====================================================================================================
const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

export function Item(props) {

  const { group, upGroupChat, upAllGroups } = props;
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

            console.log("Getting total number of messages of group on render group list:", group._id)
            //get total number of messages and discount read messages counter
            setTotalUnreadMessages(totalMessages - totalReadMessages);
            unreadMessagesController.setTotalReadMessages(group._id, totalUnreadMessages);//new

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

  {/*message notify socket listener*/}
  useEffect(() => {
   // if(statex$.default.isConnected.get()){
      socket.emit("subscribe", `${group._id}_notify`);
      socket.on("message_notify", newMessage);

      return () => {
        socket.emit("unsubscribe",`${group._id}_notify`);
        socket.off("message_notify", newMessage);
      };
     
   // }
  }, []);

 {/*Invitation socket listener*/}
  useEffect(() => {
  // if(statex$.default.isConnected.get()){
      socket.emit("subscribe", `${user._id}_invite`);
      socket.on("message_invite", newInvite);
  // }
  }, []);

   {/*Pushing notification socket listener*/}
  useEffect(() => {
  // if(statex$.default.isConnected.get()){
      socket.emit("subscribe", user._id);
      socket.on("pushing_notification", newPushnotification);
    
      return () => {
      socket.emit("unsubscribe", user._id);
      socket.off("pushing_notification", newPushnotification);
    };
  // }
  }, []);

  {/*Read messages socket listener*/}
  useEffect(() => {
    // if(statex$.default.isConnected.get()){
        socket.emit("subscribe", user._id);
        socket.on("read_messages", updateReadStatus);
      
        return () => {
        socket.emit("unsubscribe", user._id);
        socket.off("read_messages", updateReadStatus);
      };
    // }
    }, []);

{/*banned socket listener*/}
  useEffect(() => {
  // if(statex$.default.isConnected.get()){
      socket.emit("subscribe", `${user._id}_banned`);
      socket.on("group_banned", bannedGroup);
  // }
  }, []);


  const bannedGroup = async (newData) => {
    console.log("si quiero banearte....")
    if( statex$.default.lastBannedRequest.get() !=  newData.message){

              console.log("Banned from group, please reload group list!!!!")
              statex$.default.lastBannedRequest.set(newData.message);
              console.log("push notification realmente enviada!!!!")

              console.log(newData)
      
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Secure chat: Ha sido removido del grupo!",
                  body: "Grupo: "+newData.name,
                  sound: true,
                },
                trigger: {
                  seconds: 1,
                },
              });
        
              try {
                console.log("Removing relacion grupo-llave en la invitacion")
                console.log("Grupo id")
                console.log(newData._id)
      
                DELETE_STATE_GROUP_LLAVE_BY_ID(newData._id);
      
              } catch (error) {
                console.log("Error al eliminar relacion grupo, llave")
                console.log(error)
              }
            
              upAllGroups();
      }
  }

  const updateReadStatus = async (idMsg) => {
       console.log("notificando que alguien del grupo ya leyo el id mensaje::::",idMsg)
       //TODO
       //Update message with id parameter to read 6668cdd759b7edbfb183c0dd
       EventRegister.emit("idMessagevisto",idMsg);
}



  const newPushnotification = async (msg) => {
   
  

         if( statex$.default.lastPushNotification.get() !=  msg.message){

            console.log("setting push notif message")
            statex$.default.lastPushNotification.set(msg.message);

            console.log("push notification realmente enviada!!!!")
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Secure chat: Nuevo mensaje!",
                body: "Grupo: "+msg.message,
                sound: true,
              },
              trigger: {
                seconds: 1,
              },
            });

            
        }
    //}

  }

  const newInvite = async (newData) => {
    
    
      console.log("si quiero invitarte....")
    //if(user._id != newData._id){
      if( statex$.default.lastGroupInvitation.get() !=  newData.message){

            console.log("New group invite to participate, please reload group list!!!!")
            console.log(newData)
            statex$.default.lastGroupInvitation.set(newData.message);

            Notifications.scheduleNotificationAsync({
              content: {
                title: "Secure chat: Invitacion nuevo grupo!",
                body: "Grupo: "+newData.name,
                sound: true,//true // or sound: "default"
              },
              trigger: {
                seconds: 1,
              },
            });
      
            try {
              console.log("Anadiendo relacion grupo-llave en la invitacion")
            
            
              let llaveIni =  newData.tipo=="cerrado"? undefined : "3rdn4nd03rdn4nd03rdn4nd03rdn4nd0"
              console.log("llaveIni")
              console.log(llaveIni)
              console.log("Grupo id")
              console.log(newData._id)
              console.log(newData.tipo)

              const fechaAlta = new Date().toISOString();
              ADD_STATE_GROUP_LLAVE(newData._id, llaveIni,newData.tipo,fechaAlta);

            } catch (error) {
              console.log("Error al insertar relacion grupo, llave")
              console.log(error)
            }
          
        
          
            upAllGroups();
        //}
      }
    
   


  }

  const newMessage = async (newMsg) => {

    statex$.default.moveScroll.set(true);
    console.log("message_notify");
    console.log("userId who send a message::::",  newMsg.user._id)

    const msgOrigen={
      idUser: newMsg.user._id,
      idMsg: newMsg._id,
    }
    statex$.default.userWhoSendMessage.set(msgOrigen)
    

    if (newMsg.group === group._id) {

      if (newMsg.user._id !== user._id) {

        upGroupChat(newMsg.group);
        console.log("setting last message");

        statex$.default.setLastMessage.set(newMsg);

        const activeGroupId = await AsyncStorage.getItem(ENV.ACTIVE_GROUP_ID);
        if (activeGroupId !== newMsg.group) {
          console.log("Updating total number of messages of group on new message event plus 1:")
          setTotalUnreadMessages((prevState) => prevState + 1);
          unreadMessagesController.setTotalReadMessages(group._id, totalUnreadMessages);//new
        }
      }
    }
  };

  //==================================================================================================================================================================================
  const  openGroup = async () => {

    let resGpoSelected=null;

    //Getting key and date that this group need to get and decrypt messages
    await GET_STATE_GROUP_LLAVE(group._id).then(result =>{
        resGpoSelected=result.rows._array;      
        statex$.default.llaveGrupoSelected.set(resGpoSelected[0]?.llave);
        statex$.default.fechaAltaGrupoSelected.set(resGpoSelected[0]?.fechaAlta);
    }); 

    if(statex$.default.fechaAltaGrupoSelected.get()==undefined){
      statex$.default.llaveGrupoSelected.set("3rdn4nd03rdn4nd03rdn4nd03rdn4nd0");
    }
    
    

    console.log("openning group.."+group._id );

    console.log("_id creator group.."+group.creator._id );
    console.log("user id conectado.."+user._id );
    console.log("tipo group.."+group.tipo );
    await authController.setCifrado("SI");
    //TODO: use this date to get messages
    console.log("Fecha alta al grupo")
    console.log(statex$.default.fechaAltaGrupoSelected.get())
    console.log("llave del grupo")
    console.log(statex$.default.llaveGrupoSelected.get())
    console.log("llave del grupo:"+ group._id + ":::" + statex$.default.llaveGrupoSelected.get());


    if(group.creator._id != user._id &&  statex$.default.llaveGrupoSelected.get() == undefined){
          Alert.alert ('Grupo cerrado. ','Para poder acceder a los mensajes, es necesario ingresar la llave. Por favor ingrese su llave que le han compartido. En caso contrario no podra ver los mensajes',
          [{  text: 'Ok',      } ]);
    }
    
    console.log("Updating total number of messages of group on openning a group to Zero:", group._id)
    setTotalUnreadMessages(0);
    unreadMessagesController.setTotalReadMessages(group._id, 0);//new

    //TODO: notifying user who send the message that it has been read
    //Hay q avisarle q ya s eentro al grupo y se deben marcar como leidos por parte del q recibe
    try{

      console.log("notificando que su mensaje ha sido leido por abrir bandeja:")
      const msgOrigen =statex$.default.userWhoSendMessage.get();
      //
      console.log("msgOrigen")
      console.log(statex$.default.userWhoSendMessage.get())
      if(msgOrigen !=''){
        console.log("notifyRead...")
        console.log( msgOrigen.idUser)
        console.log( msgOrigen.idMsg)
       const respo = await groupMessageController.notifyRead(
          accessToken,
          msgOrigen.idUser,
          msgOrigen.idMsg
        );
      }

      console.log("Resultado de la operacion:",respo)

    }catch(errx){
   
      console.log("Error al notificar", errx)
    }
   
   

    navigation.navigate(screens.global.groupScreen, { groupId: group._id, tipo: group.tipo, creator: group.creator });
  };

  


  return (
    <TouchableOpacity style={styles.content} onPress={openGroup}>

      {/*Logo del grupo*/}
      <Avatar  bg="cyan.500"
        size="sm"
        marginRight={3}
        style={styles.avatar}
        source={{ uri: `${ENV.BASE_PATH}/${group.image}` }}
        //source={{ uri: `${ENV.BASE_PATH}/group/group1.png` }} 
      />

      <View style={styles.infoContent}>

        <View style={styles.info}>
          <Text style={styles.name}>{group.name}</Text>
         
          <Text style={styles.messagelista} numberOfLines={2}>
            <Text>
              {lastMessage
                ? `${lastMessage?.user.firstname || lastMessage?.user.lastname
                  ? `${lastMessage?.user.firstname +"... comento" || ""} ${lastMessage?.user.lastname  || ""}`
                  : lastMessage?.user.email.substring(0,20) +"... comento"} `
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