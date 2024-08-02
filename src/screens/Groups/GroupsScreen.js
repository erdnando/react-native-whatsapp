import { useState, useEffect, useCallback } from "react";
import { View, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { IconButton, AddIcon } from "native-base";
import { size } from "lodash";
import { Group,Auth,User } from "../../api";
import { useAuth } from "../../hooks";
import { screens,MD5method,socket } from "../../utils";
import { LoadingScreen } from "../../components/Shared";
import { ListGroups, Search } from "../../components/Group";
import { Modal,FormControl,Button } from "native-base";
import * as statex$ from '../../state/local'
import { UPDATE_STATE_ALLGROUPS, GET_STATE_ALLGROUPS,GET_STATE_GROUP_READ_MESSAGE_COUNT_ALL,DELETE_STATE_GROUP_LLAVE_BY_ID,
  GET_STATE_GROUP_READ_MESSAGE_COUNT,ADD_STATE_GROUP_READ_MESSAGE_COUNT,UPDATE_STATE_GROUP_READ_MESSAGE_COUNT
 } from '../../hooks/useDA';
import { EventRegister } from "react-native-event-listeners";
import * as Notifications from 'expo-notifications';

const groupController = new Group();
const authController = new Auth();
const userController = new User();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function GroupsScreen() {
  
  const navigation = useNavigation();
  const {accessToken,updateUser,user } = useAuth();
  const [groups, setGroups] = useState(null);
  const [groupsResult, setGroupsResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [arrContadores, setArrContadores] = useState(null);
  const [nip, setNip] = useState("00000000");

  const [grupoNotificado, setGrupoNotificado] = useState('');




   {/*Read messages socket listener*/}
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


    /*useEffect(() => {
      socket.emit("subscribe", `${user._id}_notify`);
      socket.on("pushing_notification", pushing_notification);

    }, [grupoNotificado]);*/


    useEffect(() => {
      socket.emit("subscribe", `${user._id}_invite`);
      socket.on("newInvite", newInvite);

    }, [grupoNotificado]);





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
              
               // upAllGroups();
                EventRegister.emit("updatingGroups",true);
        }
    }

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
    }

    const pushing_notification = async (msg) => {

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
    }

    const newInvite = async (newData) => {
    
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
    }









  //=====================LISTENERS============================================================================

  //updatingContadores
  useEffect(() => {
  
       const eventContadores = EventRegister.addEventListener("updatingContadores", async bFlag=> {
         
              try {
                console.log("Updating contadores...")
                await GET_STATE_GROUP_READ_MESSAGE_COUNT_ALL().then(result =>{
                  resAux=result.rows._array;
               
                  if(resAux.length >0){
                    setArrContadores(resAux)
                  }
                }); 
                
              } catch (error) {
                console.error(error);
              }
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventContadores);
        }
  }, []);

  //reloading groups
  useEffect(() => {
  
       const updatingGroups = EventRegister.addEventListener("updatingGroups", async bFlag=> {
         
        upAllGroups();

        });
    
        return ()=>{
          EventRegister.removeEventListener(updatingGroups);
        }
  }, []);


//=====================ON_LOAD============================================================================
useEffect(() => {
  EventRegister.emit("updatingContadores",true);//check it!!!

}, [])


  //Valida 1a vez y presenta NIP inicial
  useEffect(() => {
      
      if(!statex$.default.isConnected.get()){
        Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',      } ]);
      }
      
      async function validateInitialModal() {

        const firtsTime=  await authController.getInitial();

        if(firtsTime=="1"){
        
          const min = 1000; 
          const max = 9999; 
          const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min; 
         
          setNip("2"+randomNumber);
        const cifrado =MD5method("2"+randomNumber).toString();

          await userController.updateUser(accessToken, { nip: cifrado });
          //hash nip
          updateUser("nip", cifrado);
          setShowModal(true);
        }
      }
      validateInitialModal();
  }, []);

  //Valida Offline
  useEffect(() => {

      if(statex$.default.isConnected.get()){
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon={<AddIcon />}
              padding={0}
              onPress={() => {
              navigation.navigate(screens.tab.groups.createGroupScreen) 
            }}
            />
          ),
        });
      }else{
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon={<AddIcon />}
              padding={0}
              onPress={() => {
                Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',      } ]);
              }}
            />
          ),
        });
      }
      

  }, []);

  //Carga todos los grupos
  useFocusEffect(
      useCallback(() => {
        (async () => {

          let response = null;

          try {

            //Get all GRUPOS!!!!
            if(statex$.default.isConnected.get()){

              response = await groupController.getAll(accessToken);
                UPDATE_STATE_ALLGROUPS(JSON.stringify(response));
            }else{
                await GET_STATE_ALLGROUPS().then(result =>{
                response=result.rows._array;
                response =JSON.parse(response[0].valor);
                });
            }

            const result = response.sort((a, b) => {
              return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
            });

            console.log("Grupos obtenidos:::::::::")
            //  console.log(result)
            console.log("User de esta app autenticado::::")
            console.log(user._id)

            setGroups(result);
            setGroupsResult(result);

            //loop result to update arrCounters
            //loop group's messages and apply new crypted key, one by one
            result.map(async (grupoUser) => {
              try {
                console.log("grupo:",grupoUser.name)
                 //console.log(grupoUser.messages_unread)
                 const arrUnRead = grupoUser.messages_unread.filter((msg) => !String(msg.lectores_message).includes(user._id));
                 //console.log("arrUnRead:::::")
                 console.log(arrUnRead.length)
                 //console.log("--------------------")c
                 UPDATE_STATE_GROUP_READ_MESSAGE_COUNT( grupoUser._id,  arrUnRead.length );
              } catch (error) {
                console.log(error)
              }
             
            });

            EventRegister.emit("updatingContadores",true);


          } catch (error) {
            console.error(error);
          }
        })();
      }, [])
  );

  //=====================FUNCIONES============================================================================

  //get all groups
  const upAllGroups=async ()=>{

      let response = null;

      try {

        //Get all GRUPOS!!!!
        if(statex$.default.isConnected.get()){

          response = await groupController.getAll(accessToken);
            UPDATE_STATE_ALLGROUPS(JSON.stringify(response));
        }else{
            await GET_STATE_ALLGROUPS().then(result =>{
            response=result.rows._array;
            response =JSON.parse(response[0].valor);
            });
        }

        const result = response.sort((a, b) => {
          return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
        });

        setGroups(result);
        setGroupsResult(result);


        const d = new Date();
        let ms = d.getMilliseconds();
        statex$.default.lastBannedRequest.set(ms)
        statex$.default.lastGroupInvitation.set(ms)

      } catch (error) {
        console.error(error);
      }

      
  }
   
  const upGroupChat = (groupId) => {

      const data = groupsResult;
      const fromIndex = data.map((group) => group._id).indexOf(groupId);
      const toIndex = 0;
      const element = data.splice(fromIndex, 1)[0];
    
      data.splice(toIndex, 0, element);
      setGroups([...data]);
  };

//upGroupChat={upGroupChat} 
    //=====================VIEW============================================================================
  if (!groupsResult) return <LoadingScreen />;

  return (
    <View>
      {size(groups) > 0 && <Search data={groups} setData={setGroupsResult} />}
      <ListGroups groups={size(groups) === size(groupsResult) ? groups : groupsResult} upAllGroups={upAllGroups} 
                   contador= {arrContadores}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />

          <Modal.Header>NIP</Modal.Header>

          <Modal.Body>
          Conserve su NIP para acceder a sus mensajes
            <FormControl>
            <Modal.Header  alignItems={"center"} width={"100%"}  >{nip}</Modal.Header>
            
            </FormControl>
            Recuerde que puede modificar su NIP, Alias de participante y foto en el apartado de ajustes en cualquier momento.
          </Modal.Body>

          <Modal.Footer>
            <Button.Group space={2}>
            
              <Button               
              onPress={() => {
                setShowModal(false);
            }}>
                Aceptar
              </Button>
            </Button.Group>
          </Modal.Footer>


        </Modal.Content>
      </Modal>
    </View>
  );
}