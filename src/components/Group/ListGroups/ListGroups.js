import { View, ScrollView, Text, Platform } from "react-native";
import { useEffect } from "react";
import { map, size } from "lodash";
import { Item } from "./Item";
import { styles } from "./ListGroups.styles";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue }  from 'firebase/database'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export function ListGroups(props) {

  const { groups, upAllGroups, contador } = props;  //upGroupChat

  const firebaseConfig = {
    apiKey: 'AIzaSyAkll4IuB-ps6UZvYCFyBJFNMW2z6Djm7I',
    projectId: "chat-37d8f",
    databaseURL: "https://chat-37d8f-default-rtdb.firebaseio.com",
    appId:'1:870085043873:android:fde602b8b71dc935aa72e0',
    
  };
  
  const appx = initializeApp(firebaseConfig);
  const databasefb = getDatabase(appx);

  const starCountRef = ref(databasefb);
  onValue(starCountRef, (snapshot) => {
    console.log("Cambio en db firebase.....");
    console.log(snapshot.val());
  
  });
    
  useEffect(()=>{

    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );
  },[])


//upGroupChat={upGroupChat}

  return (
    <ScrollView alwaysBounceVertical={false}>
      <View style={styles.content}>
        {size(groups) === 0 ? (
          <Text style={styles.noGroups}>
            No tienes ningun grupo, dale al (+) para crear el primero
          </Text>
        ) : (
          map(groups, (group) => (
            <Item key={group._id} group={group} upAllGroups={upAllGroups}   contador={contador}  />
          ))
         
        )}
      </View>
    </ScrollView>
  );



  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
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
       // console.log(pushTokenString);
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }




}