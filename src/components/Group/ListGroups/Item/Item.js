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
import { GET_STATE_GROUP_LLAVE } from '../../../../hooks/useDA';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


//====================PUSH NOTIFICATIONS=================================================================================

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken, msg) {

  //ExponentPushToken[_8KiTQAUGGwPGKxxcjixN7]
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Secure chat (Nuevo mensaje)',
        body: msg,
        data: { someData: 'goes here' },
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
}

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
    const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}
//=====================================================================================================


const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

export function Item(props) {

  const { group, upGroupChat } = props;
  const { accessToken, user } = useAuth();
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);

  const navigation = useNavigation();

  //===============push notification=============================================================================

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef(Notifications?.Subscription);//>({});
  const responseListener = useRef(Notifications?.Subscription);//<Notifications?.Subscription>({});

  useEffect(() => {

    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {

      notificationListener.current && Notifications.removeNotificationSubscription( notificationListener.current, );

      responseListener.current &&  Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  //=======================================================================================================

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
    
    console.log("message_notify");

    if (newMsg.group === group._id) {

      //console.log("expoPushToken")
       //console.log(statex$.default.expoPushToken.get())
       // await sendPushNotification(statex$.default.expoPushToken.get(), newMsg.message);
   


      if (newMsg.user._id !== user._id) {

        console.log("expoPushToken")
        console.log(statex$.default.expoPushToken.get())
        await sendPushNotification(statex$.default.expoPushToken.get(), newMsg.message);


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

    //console.log("expoPushToken openGroup")
    statex$.default.expoPushToken.set(expoPushToken)
    //console.log(expoPushToken)
    //await sendPushNotification(expoPushToken, group._id );
    

    console.log("openning group.."+group._id );
    console.log("_id creator group.."+group.creator._id );
    console.log("user id conectado.."+user._id );
    console.log("tipo group.."+group.tipo );

    if(group.tipo=="cerrado"){

        await authController.setCifrado("SI");

        let resAux=null;
        await GET_STATE_GROUP_LLAVE(group._id).then(result =>{
              resAux=result.rows._array;
          
              statex$.default.llaveGrupoSelected.set(resAux[0]?.llave)
        }); 

    }else{
        statex$.default.llaveGrupoSelected.set("3rdn4nd03rdn4nd03rdn4nd03rdn4nd0");
    }
      
    console.log("llave del grupo:"+ group._id + ":::" + statex$.default.llaveGrupoSelected.get());


    if(group.creator._id != user._id &&  statex$.default.llaveGrupoSelected.get() == undefined){
          Alert.alert ('Grupo cerrado. ','Para poder acceder a los mensajes, es necesario ingresar la llave. Por favor ingrese su llave que le han compartido. En caso contrario no podra ver los mensajes',
          [{  text: 'Ok',      } ]);
    }
    
    setTotalUnreadMessages(0);

    navigation.navigate(screens.global.groupScreen, { groupId: group._id, tipo: group.tipo, creator: group.creator });
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