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
    statex$.default.isConnected.set(state.isConnected);
    //statex$.default.isConnected.set(false);
    
  });

  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <AuthProvider>
            <HandlerNavigation />
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationContainer>

  );

}
