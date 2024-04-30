import { useState, useEffect, createContext } from "react";
import { User, Auth, Group } from "../api";
import { hasExpiredToken } from "../utils";
import Constants from 'expo-constants';  

import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native'
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import * as statex$ from '../state/local.js'
import {
  configureObservablePersistence,
  persistObservable,
} from '@legendapp/state/persist'
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'


const userController = new User();
const authController = new Auth();
const groupController = new Group();


export const AuthContext = createContext();

export function AuthProvider(props) {
  
  const { children } = props;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const arrUsuarios = statex$.default.user.get();


  useEffect(() => {
    NetInfo.fetch().then(async state => {
      //console.log('Connection type', state.type);
     // console.log('Is connected?', state.isConnected);

      if(state.isConnected){
        statex$.default.flags.offline.set('true'); //false
        
      }else{
        Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',
            onPress: async ()=>{
              console.log('modo offline!');
              statex$.default.flags.offline.set('true');
            }
          } ]);
      }
    });

    configureObservablePersistence({
      // Use AsyncStorage in React Native
      pluginLocal: ObservablePersistAsyncStorage,
      localOptions: {
        asyncStorage: {
          // The AsyncStorage plugin needs to be given the implementation of AsyncStorage
          AsyncStorage,
        },
      },
    })
    
   persistObservable(statex$, {
    pluginLocal: ObservablePersistAsyncStorage,
    local: 'localState', // Unique name
  })
 

  }, []);



  useEffect(() => {
    (async () => {
    

      console.log("RESETEANDO!!!!!!!!!!!!!!")
     //get UUID
     const idApp = Constants.installationId;
     // await authController.removeTokens();

     const userRegistrado = await authController.login(idApp, idApp  );
     const { access, refresh } = userRegistrado;

     console.log("accessTokenx:" + access);

     if(access=="" || access == undefined){
      //if it's not registered, registered it
      console.log("Registrando:" + idApp);

      await authController.register(idApp, idApp);

        const responseLogin = await authController.login(idApp,idApp);

        console.log("login:::::::");
        console.log(responseLogin);

        const { access, refresh } = responseLogin;

        await authController.setAccessToken(access);
        await authController.setRefreshToken(refresh);
        setUser(idApp);

        console.log("access")
        console.log(access)
        //Creating its own personal group
        //-------------------------------------------------------------
        
        await groupController.createAuto(
          access,
          idApp,
          idApp,
          idApp
        );
        //-------------------------------------------------------------
       
        //show alert with initial NIP
        await authController.setInitial("1");
        //1a vez, bandera de mensajes cifrados
        await authController.setCifrado("SI");
        
        
        await login(access);
       
    }else{
      console.log("Accessing directly");
      await authController.setInitial("0");
      //siempre cifrados cuando entra
      await authController.setAccessToken(access);
      await authController.setRefreshToken(refresh);
      await login(access);  
      console.log("login ok!!!!!!!!")
    }

      setLoading(false);
    })();
  }, []);

  
  const reLogin = async (refreshToken) => {
    try {
      const { accessToken } = await authController.refreshAccessToken(
        refreshToken
      );
      await authController.setAccessToken(accessToken);
      await login(accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (accessToken) => {
    try {
      setLoading(true);

      const response = await userController.getMe(accessToken);
      console.log("response getMe::::")
      console.log(response)

      setUser(response);
      setToken(accessToken);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authController.removeTokens();
  };

  const updateUser = (key, value) => {
    setUser({
      ...user,
      [key]: value,
    });
  };

  const data = {
    accessToken: token,
    user,
    login,
    logout,
    updateUser,
  };

  if (loading) return null;

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}