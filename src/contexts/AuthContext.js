import { useState, useEffect, createContext } from "react";
import { User, Auth, Group } from "../api";
import { hasExpiredToken} from "../utils";
import Constants from 'expo-constants';  
import * as SQLite from 'expo-sqlite';
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
  const [idAPPEmail, setIdAppEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  
  const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
  const [userDB,setUserDB] = useState([]);


  const arrUsuarios = statex$.default.user.get();

  useEffect(() => {
    NetInfo.fetch().then(async state => {
      //console.log('Connection type', state.type);
     // console.log('Is connected?', state.isConnected);

      if(state.isConnected){
        setOffline(false)
      }else{
        Alert.alert ('Sin conexion a internet. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',
            onPress: ()=>{
              console.log('modo offline!');
              setOffline(true)
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

        //==================================================================================================
        //==================================================================================================
        console.log("on init:::::");   
        statex$.default.user.set([]);
        statex$.default.groups.set([]);

            //get UUID
            const idApp = "a20b82e7-a35f-4de1-9eb9-3c4ac26432f2";//Constants.installationId;

            console.log("idApp:" + idApp);
            //=====1=================================================================
            //const userRegistrado = await authController.login(idApp, idApp  );
            const arrUsers =authController.loginLocal( idApp );

            //console.log("arrUsers:::::");
            //console.log(arrUsers.length);
          
          

            if(arrUsers.length==0 || arrUsers == undefined){

              if(!offline){
                
              
                //if it's not registered, registered it
                console.log("Registrando:" + idApp);
                
                //=====2=================================================================
                //await authController.register(idApp, idApp);
                //Requiere de internet para generar el token
                const {_id,email,hashPassword,nipCifrado,token,nip }= await authController.preparaRegister(idApp,idApp);
                

                await authController.registerLocal(_id,idApp, hashPassword, nipCifrado,token,nip);

                //=====3=================================================================
                //const responseLogin = await authController.login( idApp,idApp);
                //const responseLogin = await authController.logindb( idApp,idApp,db);
                const userRegistrado =  authController.loginLocal(idApp );
                //console.log("userRegistrado:::::");
                //console.log(userRegistrado);
              
        

              // console.log("login",responseLogin);

                //const { access, refresh } = responseLogin;

                //una vez autenticado la 1a vez, persiste el token en el dispositivo
               // console.log("persisitiendo token");
                await authController.setAccessToken(token);
                await authController.setRefreshToken(token);
                //setUser(idApp);
                setIdAppEmail(idApp);

                //Creating its own personal group
               // console.log("creating its own personal group.......")
                //-------------------------------------------------------------
                
                //=====4===here==============================================================
                //await groupController.createAuto( access, idApp, idApp,idApp );
              await groupController.createAutoLocal( idApp, idApp,idApp,userRegistrado);
                //-------------------------------------------------------------
              
                //show alert with initial NIP
                await authController.setInitial("1");
                //1a vez, bandera de mensajes cifrados
                await authController.setCifrado("SI");
                
                
              // await login(token);
                //console.log("userArr[0]:::::");
                //console.log(userArr[0]);

                setUser(userRegistrado[0]);
                setToken(token);

              }else{
                //sin conexion y sin haber iniciado al meos la 1a vez con internet
                Alert.alert ('Sin conexion a internet. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
                [{  text: 'Ok',
                    onPress: async ()=>{
                      console.log('modo offline!');
                      //======================================================
                      //TODO
                      //Show a temp view  with a retry option in another moment
                    
                    //========================================================
      
                    }
                  } ]);
                
              }
              
            }else{
              console.log("Accessing directly");
              await authController.setInitial("0");
              //siempre cifrados cuando entra
              await authController.setAccessToken(token);
              await authController.setRefreshToken(token);
            // await login(token);  

              //console.log("userRegistrado:::::");
             // console.log(arrUsers[0]);

              //onsole.log("token:::::");
              console.log(token);

              setUser(arrUsers[0]);
              setIdAppEmail(idApp);
              setToken(token);
            }

            //console.log("estado final");
            //console.log("USUARIOS:::::::::::::::::::::::::::");
            //console.log(statex$.default.user.get());
            //console.log("GRUPOS:::::::::::::::::::::::::::");
            //console.log(statex$.default.groups.get());
        
        setLoading(false);
        //==================================================================================================
        //==================================================================================================
     

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

  const login = async (token) => {
    try {
      setLoading(true);

      const response = await userController.getMe(token);
      console.log(response);
      setUser(response);
      setToken(token);

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
    idAPPEmail
  };

  if (loading) return null;

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
