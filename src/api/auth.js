import AsyncStorage from "@react-native-async-storage/async-storage";
import * as statex$ from '../state/local'
import { ENV } from "../utils";
import { ADD_STATE_AUTHLOGIN, GET_STATE_AUTHLOGIN } from '../hooks/useDA'

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

      //console.log("params registro")
      //console.log(params)

      const response = await fetch(url, params);
      const result = await response.json();

      //console.log("result registro")
      //console.log(result)

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {

   

    //console.log("isConnected - login")
    //console.log(statex$.default.isConnected.get())
    

    if(statex$.default.isConnected.get()){
     // console.log("trying to connect to api..")
          try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.LOGIN}`;
            const params = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            };

            //console.log("login")
            //console.log(url)
           // console.log(params)
          

            const response = await fetch(url, params);
            const result = await response.json();
            //console.log("=======================================")
            //console.log("result login")
            
           // console.log(result)

            if (response.status !== 200) throw result;

            //console.log("Persistiendo ADD_STATE_AUTHLOGIN")
            //console.log(result)
            ADD_STATE_AUTHLOGIN(JSON.stringify(result))

            return result;
          } catch (error) {
            console.log(error)
            throw error;
          }

    }else{
      //offline
      let resp=null;
      await GET_STATE_AUTHLOGIN().then(result =>{
        resp= result.rows._array;
      }); 

      //console.log("GET_STATE_AUTHLOGIN")
     // console.log(JSON.parse(resp[0].valor))
      return JSON.parse(resp[0].valor);
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

async setUUID(valor) {
  await AsyncStorage.setItem(ENV.UUID, valor);
}

async getUUID() {
  return await AsyncStorage.getItem(ENV.UUID);
}


async setIdApp(valor) {
  await AsyncStorage.setItem("idApp", valor);
}

async getIdApp() {
  return await AsyncStorage.getItem("idApp");
}


async setNip(valor) {
  await AsyncStorage.setItem("nip", valor);
}

async getNip() {
  return await AsyncStorage.getItem("nip");
}

//========================================================================
  async removeTokens() {
    await AsyncStorage.removeItem(ENV.JWT.ACCESS);
    await AsyncStorage.removeItem(ENV.JWT.REFRESH);
    await AsyncStorage.removeItem("initial");

    await AsyncStorage.removeItem(ENV.UUID);
    await AsyncStorage.removeItem("cifrado");
    await AsyncStorage.removeItem("idApp");
  }


 
}