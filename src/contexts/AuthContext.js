import { useState, useEffect, createContext } from "react";
import { Auth, Group } from "../api";
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
import { fnCreateTables,deleteUserTables } from '../hooks/useDA.js'

//const userController = new User();
const authController = new Auth();
const groupController = new Group();


export const AuthContext = createContext();

export function AuthProvider(props) {
  
  const { children } = props;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState('');

  //const arrUsuarios = statex$.default.user.get();


useEffect(() => {

  fnCreateTables();
  //just to clean tables on testing and developing. On releases, commented it
  deleteUserTables();
  
}, [])




  useEffect(() => {


    NetInfo.fetch().then(async state => {
     

      if(state.isConnected){
        statex$.default.flags.offline.set('false'); //false
      }else{
        Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',
            onPress: async ()=>{
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
 

     init();

  }, []);


  const init = async () => {

      console.log("RESETEANDO!!!!!!!!!!!!!!")
     //get UUID
     const idApp = Constants.installationId;
     // await authController.removeTokens();

     console.log(idApp)
     setEmail(idApp);

     const userRef = await authController.logindb( idApp, idApp);
     console.log("logindb")
     console.log(userRef)

     //console.log("accessTokenx:" + access);

     if(userRef.length==0){
        //if it's not registered, registered it
        console.log("Registrando:" + idApp);

        const token = await authController.registerdb(idApp);

          console.log("token registrado:::::::");
          console.log(token);

          await authController.setAccessToken(token);
          await authController.setRefreshToken(token);
          setUser(idApp);
          setToken(token);

          //Creating its own personal group
          //-------------------------------------------------------------
          
         const groupCreatedRef = await groupController.createAutodb(
            idApp,
            idApp,
            idApp
          );

          console.log("groupCreatedRef")
          console.log(groupCreatedRef)
          //-------------------------------------------------------------
        
          //show alert with initial NIP
          await authController.setInitial("1");
          //1a vez, bandera de mensajes cifrados
          await authController.setCifrado("SI");
       
    }else{

      console.log("Accessing directly");
      await authController.setInitial("0");
      setUser(idApp);
      
      //siempre cifrados cuando entra
      await authController.setAccessToken(userRef[0].token);
      await authController.setRefreshToken(userRef[0].token);
      await authController.setCifrado("SI");

      setToken(userRef[0].token);

      console.log("login ok!!!!!!!!")
    }

      setLoading(false);
}

  
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

  /*const login = async (accessToken) => {
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
  };*/

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
    logout,
    updateUser,
    email
  };

  if (loading) return null;

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}