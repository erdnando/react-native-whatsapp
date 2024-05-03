import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV,MD5method } from "../utils";
import * as statex$ from '../state/local'
import * as Crypto from 'expo-crypto';
import { Types } from 'mongoose';
import { findUsersByEmail,addUser,findAllUsers } from '../hooks/useDA'
import { array } from "yup";
import { DateTime } from "luxon";


export class Auth {

//================================================================================================================================================================

async getAllUsers() {
   
  try {
         let response=null;
         await findAllUsers().then(result =>{
          response=result.rows._array
         }); 

         return response;
    } catch (error) {
     // console.log(error)
      throw error;
    }
}

  async logindb(email, password) {
   
    try {
           let response=null;
           await findUsersByEmail(email).then(result =>{
            response=result.rows._array
           }); 

           return response;
      } catch (error) {
       // console.log(error)
        throw error;
      }
  }

  //================================================================================================================================================================
  async registerdb(email) {

        let token ="";
        try {
        
          const hashPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, email );

          const min = 1000; 
          const max = 9999; 
          const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min; 
          const nip ="A"+randomNumber
          const nipCifrado =MD5method("A"+randomNumber).toString();
          const _id = new Types.ObjectId();


          try {
            const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.TOKEN}`;
            const params = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "_id": _id,
              "email": email,
              "password": hashPassword,
              "__v": 0
            }),
            };
      
            const response = await fetch(url, params);
            token = await response.json();
            //token = JSON.stringify(token)
            
            console.log("token usuario obtenido")
            console.log(token)
            
      
            if (response.status !== 200) throw result;

            //Inserting new user to local DB
            //=============================================================
              try {
                  let response=null;
                  //======================
                  const today = new Date().toISOString()
                  //=======================
                  await addUser(_id.toString() , email,hashPassword,nipCifrado,token.access ,today ).then(result =>{

                    response=result.rows._array;
                    console.log('usuario insertado')
                    console.log(result)

                  }).catch(error => {
                    console.log("Error al registrar user")
                    console.log(error)
                  }); 
      
                  return response==null ? 'Error' : token.access;
              } catch (error) {
                  console.log(error)
                throw error;
              }
            //===============================================================
            
          } catch (error) {
            throw error;
          }

         // console.log("userRef")
         // console.log(userRef)

          return token;

      } catch (error) {
        throw error;
      }
  }

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

      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      })

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

      const userRef=statex$.default.login.get();//datos de acceso persisitidos
     

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
      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
        const userRef=statex$.default.login.get();
        return {"access": userRef.access, "refresh": userRef.refresh}
      });
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



  /*
   getUsersById(email){

    console.log("::::::::getUsersById:::::::::::::::::");
  

     db.transaction( tx => {
      tx.executeSql('SELECT count(*) FROM users ', null,
        (txObj, resultSet) => statex$.default.usuariosSelect.set(resultSet.rows._array),
        (txObj, error)=> console.log(error) 
        );
      });

    console.log("2-SELECT count(*) FROM users where email=", email)

    console.log("::::::::data select:::::::::::::::::");
    console.log(statex$.default.usuariosSelect.get());
    return statex$.default.usuariosSelect.get();
  }*/

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

      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
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