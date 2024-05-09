import { useState, useEffect, createContext } from "react";
import { Auth, Group, GroupMessage } from "../api";
//import Constants from 'expo-constants';  
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
import { loadDB,fnCreateTableUsers,fnCreateTableGroups,fnCreateTableGroupMessages,fnDropTableUsers ,fnDropTableGroups, fnDropTableGroupMessages } from '../hooks/useDA.js'
import { Types } from 'mongoose';

//const userController = new User();
const authController = new Auth();
const groupController = new Group();
const groupMessageController = new GroupMessage();


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

    async function fetchData() {
      console.log(" ")
     
      try{

          loadDB();
          fnCreateTableUsers();
          fnCreateTableGroups();
          fnCreateTableGroupMessages();
          init();
       
       
      }catch(err){
        console.log("err db ini")
        console.log(err)
      }

      
      
         
      
    }

    fetchData();

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
 

 

  }, []);


  const init = async () => {

    console.log("=======parte 2 Iniciando verificacion login/registro================")
    console.log(" ")



    let uuid = await authController.getUUID();
    

    if(uuid==null){
      uuid = new Types.ObjectId().toString();
     
      await authController.setUUID(uuid);
     
    }
     //get UUID
     const idApp = uuid;//await authController.getUUID(); //Constants.installationId;

     console.log("idApp")
     console.log(idApp)
     setEmail(idApp);

     let userRef = await authController.logindb( idApp, idApp);
     console.log("usuario existente:")
     console.log(userRef)
     

     //console.log("accessTokenx:" + access);

     if(userRef.length==0){
        //if it's not registered, registered it
        console.log("Registrando usuario:" + idApp);

        const token = await authController.registerUsuariodb(idApp);

          console.log("token obtenido:::::::");
          console.log(token);

          await authController.setAccessToken(token.toString());
          await authController.setRefreshToken(token.toString());
          //setUser(idApp.toString());
          setToken(token.toString());

          //Creating its own personal group
          //-------------------------------------------------------------
          
         const groupCreatedRef = await groupController.createAutodb(
            idApp,
            idApp,
            idApp
          );
          //-------------------------------------------------------------
         
          //show alert with initial NIP
          await authController.setInitial("1");
          //1a vez, bandera de mensajes cifrados
          await authController.setCifrado("SI");
          statex$.default.flags.cifrado.set("SI");
       
    }else{

      console.log("Usuario existente");
      console.log(userRef[0])

      await authController.setInitial("0");
      //setUser(idApp);
      
      //siempre cifrados cuando entra
      await authController.setAccessToken(userRef[0].token);
      await authController.setRefreshToken(userRef[0].token);
      await authController.setCifrado("SI");
      

      setToken(userRef[0].token);

      console.log(" ")
      console.log("=======parte 3 Iniciando verificacion login/registro  OK!=========")
      console.log(" ")



      console.log(" ")
      console.log(" ")
    }


      userRef = await authController.logindb( idApp, idApp);
      statex$.default.me.set(userRef[0]);
      setUser(userRef[0]);
      //just to check groups table
      const groupAllRef = await groupController.getAllGroups();
      console.log("getAllGroups")
      console.log(groupAllRef)
      statex$.default.groups.set(groupAllRef);

      const usersAllRef = await authController.getAllUsers();
      console.log("getAllUsers")
      console.log(usersAllRef);
      statex$.default.users.set(usersAllRef);

      const messagesAllRef = await groupMessageController.getAllGroupMessage();
      console.log("getAllGroupMessage")
      console.log(messagesAllRef);
      statex$.default.messages.set(messagesAllRef);




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

    statex$.default.me.set(user);
  };

  const data = {
    accessToken: token,
    user,
    logout,
    updateUser,
    email,
  };

  if (loading) return null;

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}