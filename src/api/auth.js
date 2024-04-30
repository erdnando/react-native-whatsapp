import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "../utils";
import * as statex$ from '../state/local'



export class Auth {



  async register(email, password) {
    try {

      
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.REGISTER}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      console.log("params registro")
      console.log(params)

      const response = await fetch(url, params);
      const result = await response.json();

      console.log("result registro")
      console.log(result)

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {

    //====================================================================
    console.log('validando modo offline:::')
    console.log(statex$.default.flags.offline.get())
   //Offline validacion
   if(statex$.default.flags.offline.get()=='true'){

      console.log("modo Offline!!!!!")

      const userRef=statex$.default.login.get();

      if(userRef.user==email && userRef.pwd== password){
        return {"access": userRef.access, "refresh": userRef.refresh}
      }else{
        //Contrasena incorrecta
        return {"access": null, "refresh": null}
      }
   }
   //====================================================================




    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.LOGIN}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      console.log("login")
      console.log(url)
      console.log(params)
      const response = await fetch(url, params);
      const result = await response.json();
      console.log("=======================================")
      console.log("result login")
      
      console.log(result)

      if (response.status !== 200) throw result;


      //=============================================================
      //Offline cache
      if (response.status == 200){
        const arrLogins = statex$.default.login.get();

        const newLogin={
          user:email,
          pwd:password,
          access:result.access,
          refresh:result.refresh
        }
          statex$.default.login.set({});
          statex$.default.login.set(newLogin);
      }
      //=============================================================

      

      return result;
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
//========================================================================
  async setAccessToken(token) {
    await AsyncStorage.setItem(ENV.JWT.ACCESS, token);
  }

  async getAccessToken() {
    return await AsyncStorage.getItem(ENV.JWT.ACCESS);
  }

  //======================================================================
  async setOffline(flag) {
    await AsyncStorage.setItem("offline", flag);
  }

  async getOffline() {
    return await AsyncStorage.getItem("offline");
  }
//========================================================================
  async setRefreshToken(token) {
    await AsyncStorage.setItem(ENV.JWT.REFRESH, token);
  }

  async getRefreshToken() {
    return await AsyncStorage.getItem(ENV.JWT.REFRESH);
  }
//========================================================================
  async setInitial(bflag) {
    await AsyncStorage.setItem("initial", bflag);
  }

  async getInitial() {
    return await AsyncStorage.getItem("initial");
  }
//========================================================================
async setCifrado(valor) {
  await AsyncStorage.setItem("cifrado", valor);
}

async getCifrado() {
  return await AsyncStorage.getItem("cifrado");
}
//========================================================================
  async removeTokens() {
    await AsyncStorage.removeItem(ENV.JWT.ACCESS);
    await AsyncStorage.removeItem(ENV.JWT.REFRESH);
    await AsyncStorage.removeItem("offline");
    await AsyncStorage.removeItem("initial");
  }


 
}