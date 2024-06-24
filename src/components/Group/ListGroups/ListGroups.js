import { View, ScrollView, Text, Platform } from "react-native";
import { useState, useEffect } from "react";
import { map, size } from "lodash";
import { Item } from "./Item";
import { styles } from "./ListGroups.styles";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useAuth } from "../../../hooks";
import * as statex$ from '../../../state/local';
import { GET_STATE_GROUP_READ_MESSAGE_COUNT,GET_STATE_GROUP_READ_MESSAGE_COUNT_ALL } 
from '../../../hooks/useDA.js';

import { socket } from "../../../utils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export function ListGroups(props) {

  const { groups, upGroupChat, upAllGroups, contador } = props;
  const [expoPushToken, setExpoPushToken] = useState('');
  //const [contador, setContador] = useState(0);
  const [grupoAfectado, setGrupoAfectado] = useState('');
  const { accessToken, user } = useAuth();
  const { arrContadores, setArrContadores } = useState([]);
  

 



  useEffect(()=>{

    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );


    
  },[])

 



const getContador = async (grupo)=>{
  console.log("getting counter...."+ grupo);
 // let auxReturn =1;

  
   console.log("async way")
    let resAux=null;
     await GET_STATE_GROUP_READ_MESSAGE_COUNT(grupo).then(result =>{
        resAux=result.rows._array;
        console.log("selecting from db")
        
        if(resAux.length==0){
          console.log("returning 0")
          return 0;
        }else{
          console.log("returning contador")
          console.log(Number(resAux[0].contador))

          return Number(resAux[0].contador);
        }
      
    }); 
  

}


  async function getCounter(grupo){
  console.log("getting counter...."+ grupo);
  // let auxReturn =1;
 
   
    console.log("async way")
     let resAux=null;
        await GET_STATE_GROUP_READ_MESSAGE_COUNT(grupo).then(result =>{
         resAux=result.rows._array;
         console.log("selecting from db")
         
         if(resAux.length==0){
           console.log("returning 0")
           return 0;
         }else{
           console.log("returning contador")
           console.log(Number(resAux[0].contador))
 
           return Number(resAux[0].contador);
         }
       
     }); 
}



  //console.log("Token: ", expoPushToken);

  return (
    <ScrollView alwaysBounceVertical={false}>
      <View style={styles.content}>
        {size(groups) === 0 ? (
          <Text style={styles.noGroups}>
            No tienes ningun grupo, dale al (+) para crear el primero
          </Text>
        ) : (
          map(groups, (group) => (
            <Item key={group._id} group={group} upGroupChat={upGroupChat} upAllGroups={upAllGroups} 
                  contador={contador}  />
          ))
         
        )}
      </View>
    </ScrollView>
  );






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




}