import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { HandlerNavigation } from "./src/navigations";
import { AuthProvider } from "./src/contexts";
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from "react";
import * as statex$ from './src/state/local'
import * as Notifications from 'expo-notifications';
//import { initializeApp } from 'firebase/app';
//import { getDatabase, ref, onValue }  from 'firebase/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {

 
  const unsubscribe = NetInfo.addEventListener(state => {
    //console.log('Is connected?', state.isConnected);
    statex$.default.isConnected.set(state.isConnected)
    
  });

  /*const firebaseConfig = {
    apiKey: 'AIzaSyAkll4IuB-ps6UZvYCFyBJFNMW2z6Djm7I',
    projectId: "chat-37d8f",
    databaseURL: "https://chat-37d8f-default-rtdb.firebaseio.com",
    appId:'1:870085043873:android:fde602b8b71dc935aa72e0',
    
  };

  const appx = initializeApp(firebaseConfig);
  const databasefb = getDatabase(appx);

  const starCountRef = ref(databasefb);
  const [expoPushToken, setExpoPushToken] = useState("");*/


  /*onValue(starCountRef, async (snapshot) => {
    console.log("Cambio en db firebase.....");
    console.log(snapshot.val());
    console.log("expoPushToken")
    console.log(expoPushToken)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Secure chat",
        body: "nuevo mensaje ",
        sound: true,
      },
      trigger: {
        seconds: 1,
      },
    });

  });*/

  

  /*useEffect( async ()=>{

    await registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)        
      
    );



  },[expoPushToken])*/




  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <AuthProvider>
            <HandlerNavigation />
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationContainer>

  );




/*
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
        console.log(pushTokenString);

       
        return pushTokenString;
      } catch (e) {
        console.log("Error")
        console.log(e)
        handleRegistrationError(`${e}`);
      }

    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }
  */



}
