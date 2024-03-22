import { useState, useEffect, createContext } from "react";
import { User, Auth, Group } from "../api";
import { hasExpiredToken } from "../utils";
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';


const userController = new User();
const authController = new Auth();
const groupController = new Group();

export const AuthContext = createContext();

export function AuthProvider(props) {
  
  const { children } = props;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  //Metodo incial
  useEffect(() => {
    (async () => {
      //const [db, setDb] = useState(SQLite.openDatabase('example.db'))




      //get UUID
      const idApp = Constants.installationId;
     // await authController.removeTokens();

     const userRegistrado = await authController.login(idApp, idApp  );
     const { access, refresh } = userRegistrado;

     console.log("accessToken:" + access);

     if(access=="" || access == undefined){
      //if it's not registered, registered it
      console.log("Registrando:" + idApp);

      await authController.register(idApp, idApp);

        const responseLogin = await authController.login( idApp,idApp);

        console.log("login",responseLogin);

        const { access, refresh } = responseLogin;

        await authController.setAccessToken(access);
        await authController.setRefreshToken(refresh);
        setUser(idApp);

        //Creating its own personal group
        //-------------------------------------------------------------
        
        await groupController.createAuto(
          access,
          idApp,
          idApp,
          idApp
        );
        //-------------------------------------------------------------

        await login(access);
    }else{
      console.log("Accessing directly")
      await authController.setAccessToken(access);
      await authController.setRefreshToken(refresh);
      await login(access);  
    }



/*
      const accessToken = await authController.getAccessToken();
      const refreshToken = await authController.getRefreshToken();
     
      
      //validate if is there a valid token
      if (!accessToken || !refreshToken) {
       
         //if not --> generate a new token
         //register new device
         //persist it
         //=============================================================
         try {
         
          console.log("idAppx:::::")
          console.log(idApp);
          //validate if device is registered
          const response = await authController.login(idApp, idApp  );
          const { access, refresh } = response;
         // console.log(response1);
         
          console.log(access);
          console.log("access");

          if(access==""){
              //if it's not registered, registered it
              console.log("Registrando:" + idApp);

              await authController.register(idApp, idApp);

                const response = await authController.login( idApp,idApp);

                console.log(response);

                const { access, refresh } = response;

                await authController.setAccessToken(access);
                await authController.setRefreshToken(refresh);

                await login(access);
          }else{
            console.log("Accessing directly")
            await authController.setAccessToken(access);
            await authController.setRefreshToken(refresh);
            await login(access);  
          }
          
            
          } catch (error) {
            console.error(error);
          }
        //=============================================================
      }else{

        //=================================================
        //consultar DB para efectos de demo
        //==================================================

        const response = await authController.login(idApp, idApp  );
          const { access, refresh } = response;
          if(access==""){
            //if it's not registered, registered it
            console.log("Registrando:" + idApp);

            await authController.register(idApp, idApp);

              const response = await authController.login( idApp,idApp);

              console.log(response);

              const { access, refresh } = response;

              await authController.setAccessToken(access);
              await authController.setRefreshToken(refresh);

              await login(access);
        }else{
          console.log("Accessing directly")
          await authController.setAccessToken(access);
          await authController.setRefreshToken(refresh);
          await login(access);  
        }

     
      }
     */
      
     /*
      if (!accessToken || !refreshToken) {
        logout();
        setLoading(false);
        return;
      }

      if (hasExpiredToken(accessToken)) {
        if (hasExpiredToken(refreshToken)) {
          logout();
        } else {
          reLogin(refreshToken);
        }
      } else {
        console.log("Accessing directly")
        await login(accessToken);
      }*/

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
