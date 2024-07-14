import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert,AppState } from "react-native";
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
import { GET_STATE_GROUP_LLAVE, ADD_STATE_GROUP_LLAVE, DELETE_STATE_GROUP_LLAVE_BY_ID,GET_STATE_GROUP_READ_MESSAGE_COUNT,ADD_STATE_GROUP_READ_MESSAGE_COUNT,UPDATE_STATE_GROUP_READ_MESSAGE_COUNT } from '../../../../hooks/useDA';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

//====================PUSH NOTIFICATIONS=================================================================================

/*Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});*/

//=====================================================================================================
const groupMessageController = new GroupMessage();
const unreadMessagesController = new UnreadMessages();
const authController = new Auth();

export function Item(props) {
//,
  const { group, upAllGroups,contador } = props;// upGroupChat, 
  const { accessToken, user } = useAuth();
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [contadorAux, setContadorAux] = useState(0);
  //const [grupoNotificado, setGrupoNotificado] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);
  const navigation = useNavigation();
  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';



  useEffect(() => {
    TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
      console.log('Received a notification in the background!');
      // Do something with the notification data
      let notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Secure chat: Nuevo mensaje background!",
          body: "Grupo: Aviso!!!!!",
          sound: true,
        },
        trigger: {
          seconds: 1,
          repeats:false
        },
      });
      
    });
    
    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    
  }, []);



  useEffect(() => {

    const handleAppStateChange = (nextAppState) => {
      console.log("Estado")
      console.log(nextAppState);

      if(nextAppState=="background"){

      }
      if(nextAppState=="active"){
        Notifications.dismissAllNotificationsAsync();
      }
      
      setAppState(nextAppState);
    };


    AppState.addEventListener('change', handleAppStateChange);
    /*try{
      return () => {
        AppState.removeEventListener('change', handleAppStateChange);
      };
    }catch(err){

    }*/
    

  }, [])
  
 /*
  //Read messages socket listener
  useEffect(() => {
   
    // if(statex$.default.isConnected.get()){
    
        socket.emit("subscribe", user._id);
        socket.on("group_banned", bannedGroup);
        socket.on("newMessagex", newMessagex);
        socket.on("newMessagex_me", newMessagex_me);

        return () => {
        socket.emit("unsubscribe", user._id);
        socket.off("group_banned", bannedGroup);
        socket.off("newMessagex", newMessagex);
        socket.off("newMessagex_me", newMessagex_me);
        }
      
    // }
    }, [grupoNotificado]);


    useEffect(() => {
      socket.emit("subscribe", `${user._id}_notify`);
      socket.on("pushing_notification", pushing_notification);

    }, [grupoNotificado]);


    useEffect(() => {
      socket.emit("subscribe", `${user._id}_invite`);
      socket.on("newInvite", newInvite);

    }, [grupoNotificado]);
*/

  //Get messages read and totals
  useEffect(() => {

    (async () => {
      try {
          // console.log("El contador se actualizo.................")
         //  console.log(contador)
           const cont = contador?.find(o => o.groupId === group._id);

           if(cont!=undefined){

            setContadorAux(cont["contador"])
           }
           
     
            const totalParticipants = await groupMessageController.getGroupParticipantsTotal(
              accessToken,
              group._id
            );
            setTotalMembers(totalParticipants);
            
            //==============================Get messages from DB========================================================
            const totalMessages = await groupMessageController.getTotal(accessToken, group._id );//From DB

            //==============================Get messages read from AsynStorage==========================================
            const totalReadMessages = await unreadMessagesController.getTotalReadMessages(group._id);//From AsyncStorage
           
            //==============================Mensajes NO leidos==========================================================
            setTotalUnreadMessages(totalMessages - totalReadMessages);

            //==========================================================================================================
            const eventGrupo = EventRegister.addEventListener("participantsModified", async data=>{
              console.log("participantsModified listener...");
            
                  try {
                    const totalParticipants = await groupMessageController.getGroupParticipantsTotal(
                      accessToken,
                      group._id
                    );
                    setTotalMembers(totalParticipants);
                  //  console.log("group and groupResult updated...");
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
  }, [group._id,contadorAux,contador]);

  //getLastMessage
  useEffect(() => {
    (async () => {
      try {
        const response = await groupMessageController.getLastMessage(accessToken,group._id);
       // console.log("===========================");
       // console.log(response);
        if (!isEmpty(response)) setLastMessage(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [group._id]);




   //Aviso de nuevo mensaje para el resto del grupo
   /*const pushing_notification = async (msg) => {

    //Notifications.dismissAllNotificationsAsync();
    console.log("push notification")

    if( statex$.default.lastPushNotification.get() !=  msg.message){
      console.log("notify por pushing_notification a nex message")
  
      // console.log("setting push notif message")
       statex$.default.lastPushNotification.set(msg.message);
  
       //Push notification=========================================================
         // console.log("push notification realmente enviada!!!!")
         await Notifications.scheduleNotificationAsync({
          content: {
            title: "Secure chat: Nuevo mensaje!",
            body: "Grupo: "+msg.message,
            sound: true,
          },
          trigger: {
            seconds: 1,
            repeats:false
          },
        });
        //LOCAL NOTIFICATION=================================================================
   }
  }*/


//==============================================================================================================================================================================
  //Aviso de nuevo mensaje para el resto del grupo
  /*
  const newMessagex = async (msg) => {
    Notifications.dismissAllNotificationsAsync();
    if( statex$.default.lastPushNotification.get() !=  msg.message){
     // console.log("notify por pushing_notification a nex message")
  
      // console.log("setting push notif message")
       statex$.default.lastPushNotification.set(msg.message);
  
       let resAux=null;
       setGrupoNotificado(msg.group)
       await GET_STATE_GROUP_READ_MESSAGE_COUNT(msg.group).then(result =>{
             resAux=result.rows._array;

             if(resAux.length==0){
             // console.log("No se encontro el grupo")
              // console.log("ADD_STATE_GROUP_READ_MESSAGE_COUNT " + msg.group);
               ADD_STATE_GROUP_READ_MESSAGE_COUNT( msg.group,1);
              EventRegister.emit("updatingContadores",true);
             }else{
              if(resAux[0].contador==null)resAux[0].contador=0;
  
               let numberAux =Number(resAux[0].contador)+1;
               UPDATE_STATE_GROUP_READ_MESSAGE_COUNT( msg.group,  numberAux );
              EventRegister.emit("updatingContadores",true);
             }
           
         }); 
  
       //New message============================================================
       EventRegister.emit("newMessagex",msg);
       //=======================================================================
       EventRegister.emit("updatingContadores",true);
   }
  }
  
  const newMessagex_me = async (msg) => {
    //console.log("notify por pushing_notification me")
   Notifications.dismissAllNotificationsAsync();

    //console.log("notify por pushing_notification me x")
    if( statex$.default.lastPushNotification.get() !=  msg.message){
        console.log("notify por pushing_notification me")


       //New message============================================================
       statex$.default.lastPushNotification.set(msg.message);
      

       //Local Notify always 0 because it's himself===========================================================
       let resAux=null;
       await GET_STATE_GROUP_READ_MESSAGE_COUNT(msg.group).then(result =>{
             resAux=result.rows._array;

  
             if(resAux.length==0){
               //add it
               //console.log("ADD_STATE_GROUP_READ_MESSAGE_COUNT " + msg.group);
               ADD_STATE_GROUP_READ_MESSAGE_COUNT( msg.group,0);
               EventRegister.emit("updatingContadores",true);

             }else{
              if(resAux[0].contador==null)resAux[0].contador=0;
  
               UPDATE_STATE_GROUP_READ_MESSAGE_COUNT( msg.group,  0 );
               EventRegister.emit("updatingContadores",true);

             }
           
         }); 
       //=======================================================================

       EventRegister.emit("newMessagex_me",msg);

   }
  }*/

  /*const bannedGroup = async (newData) => {
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
            
             // upAllGroups();
              EventRegister.emit("updatingGroups",true);
      }
  }*/

  /*const newInvite = async (newData) => {
    
    console.log("si quiero invitarte....");
   
    //if(user._id != newData._id){
      if( statex$.default.lastGroupInvitation.get() !=  newData.message){

            //console.log("New group invite to participate, please reload group list!!!!")
            //console.log(newData)
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
             // console.log("Anadiendo relacion grupo-llave en la invitacion")
              let llaveIni =  newData.tipo=="cerrado"? undefined : "3rdn4nd03rdn4nd03rdn4nd03rdn4nd0"

              const fechaAlta = new Date().toISOString();
              ADD_STATE_GROUP_LLAVE(newData._id, llaveIni,newData.tipo,fechaAlta);

            } catch (error) {
              console.log("Error al insertar relacion grupo, llave")
              console.log(error)
            }
          
        
          
            upAllGroups();
        //}
      }
  }*/

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
    
    
    Notifications.dismissAllNotificationsAsync();
    console.log("openning group.."+group._id );

   
    statex$.default.cifrado.set("SI");
  
    if(group.creator._id != user._id &&  statex$.default.llaveGrupoSelected.get() == undefined){
          Alert.alert ('Grupo cerrado. ','Para poder acceder a los mensajes, es necesario ingresar la llave. Por favor ingrese su llave que le han compartido. En caso contrario no podra ver los mensajes',
          [{  text: 'Ok',      } ]);
    }
    
      setTotalUnreadMessages(0);

    try{
           console.log("(openning) notificando q ya leyo msg el miembro", user._id, " en el grupo: ", group._id);

           //Solicitandi q se actualicen en visto todos los mensajes del grupo al q estoy accediendo
            const respo = await groupMessageController.notifyRead(
              accessToken,
              user._id,
              group._id
            );

    }catch(errx){
   
      console.log("Error al notificar", errx)
    }
   
   
   // console.log('reseteando contador del grupo', group._id)
    UPDATE_STATE_GROUP_READ_MESSAGE_COUNT( group._id,  0 );
    EventRegister.emit("updatingContadores",true);

    statex$.default.fromOpenning.set(true);

    navigation.navigate(screens.global.groupScreen, { groupId: group._id, tipo: group.tipo, creator: group.creator });
  };

  
  return (
    <TouchableOpacity style={styles.content} onPress={openGroup}>

      {/*Logo del grupo*/}
      <Avatar  bg="cyan.500"
        size="sm"
        marginRight={3}
        style={styles.avatar}
        source={{ uri: `${ENV.BASE_PATH}/${group.image == undefined ? "group/group1.png" : group.image}` }}
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

          { contadorAux>0 ? (
            <View style={styles.totalUnreadContent}>
              <Text style={styles.totalUnread}>
                { contadorAux < 99 ?  contadorAux : 99}
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