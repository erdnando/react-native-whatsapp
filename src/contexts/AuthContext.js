import { useState, useEffect, createContext } from "react";
import { User, Auth, Group } from "../api";
import { hasExpiredToken } from "../utils";
import Constants from 'expo-constants';  

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
    (async () => {
    
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