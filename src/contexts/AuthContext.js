import { useState, useEffect, createContext } from "react";
import {  Alert} from 'react-native';
import { User, Auth, Group } from "../api";
import { hasExpiredToken } from "../utils";
import Constants from 'expo-constants';  
import { Types } from 'mongoose';
import { CREATE_STATE_AUTHLOGIN,CREATE_STATE_GETME, ADD_STATE_GETME, GET_STATE_GETME, 
  CREATE_STATE_ALLGROUPS,CREATE_STATE_ALLMESSAGES,CREATE_STATE_GROUP_LLAVE, 
  ADD_STATE_ALLMESSAGES,ADD_STATE_ALLGROUPS } from '../hooks/useDA.js';
  import { observable } from "@legendapp/state";
  import { observer } from "@legendapp/state/react";
  import * as statex$ from '../state/local.js'
  import {
    configureObservablePersistence,
    persistObservable,
  } from '@legendapp/state/persist'
  import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import NetInfo from '@react-native-community/netinfo';
  

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






  useEffect(() => {

    async function fetchData() {
      console.log(" ")
     
      try{

          CREATE_STATE_AUTHLOGIN();//ok
          CREATE_STATE_GETME();//ok
          CREATE_STATE_ALLGROUPS();//ok
          CREATE_STATE_ALLMESSAGES();//ok
          CREATE_STATE_GROUP_LLAVE();
          ADD_STATE_ALLGROUPS("ggg")
       

     
       
      }catch(err){
        console.log("err db ini")
        console.log(err)
      }
    }

    fetchData();

}, [])



  useEffect(() => {
    (async () => {

      let uuid = await authController.getUUID();
      if(uuid==null){
        uuid = new Types.ObjectId().toString();
      
        await authController.setUUID(uuid);
      
      }
    
     //get UUID
     const idApp = uuid;//Constants.installationId;
     //await authController.removeTokens();

     console.log("Login user:")
     console.log(idApp)
     console.log(statex$.default.isConnected.get())
     const userRegistrado = await authController.login(idApp, idApp );

     console.log("userRegistrado")
     console.log(userRegistrado  )


     const { access, refresh } = userRegistrado;

     console.log("accessTokenx:" + access);
     
/*
     if( (access=="" || access == undefined) && isConnected==false){
      Alert.alert('La app esta sin acceso a internet. Por favor intentelo de nuevo cuando tenga conexion');
      return;
     }*/

     if(access=="" || access == undefined){
      //if it's not registered, registered it
      console.log("Registrando: " + idApp);
      //reset asyncStorage
     // await authController.removeTokens();
      //
      await authController.setIdApp(idApp);

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
      console.log("login::")
      console.log(access)
      await authController.setInitial("0");
      await authController.setIdApp(idApp);
      //siempre cifrados cuando entra
      await authController.setAccessToken(access);
      await authController.setRefreshToken(refresh);


      await login(access);  
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

    let response = null;
    try {
      setLoading(true);

      if(statex$.default.isConnected.get()){
        response = await userController.getMe(accessToken);

        console.log("Persistiendo ADD_STATE_GETME")
        console.log(response)
        ADD_STATE_GETME(JSON.stringify(response))

      }else{
       
        await GET_STATE_GETME().then(result =>{
        response=result.rows._array;

        response = JSON.parse(response[0].valor);
      }); 
      }
      


      


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