import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV, MD5method } from "../utils";
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { Types } from 'mongoose';

import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import * as statex$ from '../state/local.js'

export class Auth {


//======================================================================================================================================================
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

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
//======================================================================================================================================================
  async login(email, password) {

   

    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.AUTH.LOGIN}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      const response = await fetch(url, params);
      const result = await response.json();
      

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
//======================================================================================================================================================
   async db_create_tables(db){

   
      //Dropping tables commands
      /*
     db.transaction( tx =>{
        tx.executeSql('DROP TABLE IF EXISTS users; ', null,
          (txObj,resulSet) =>{
            console.log("tabla users dropeada:");
          },
          (txObj, error) => console.log(error)
          );
      });
 
      db.transaction( tx =>{
        tx.executeSql('DROP TABLE IF EXISTS groups; ', null,
          (txObj,resulSet) =>{
            console.log("tabla groups dropeada:");
          },
          (txObj, error) => console.log(error)
          );
      });

      db.transaction( tx =>{
        tx.executeSql('DROP TABLE IF EXISTS groupmessages; ', null,
          (txObj,resulSet) =>{
            console.log("tabla groupmessages dropeada:");
          },
          (txObj, error) => console.log(error)
          );
      });
      */


     


          await db.transaction( tx => {

        
             tx.executeSql('CREATE TABLE IF NOT EXISTS users (_id TEXT PRIMARY KEY,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, avatar64 TEXT,access TEXT,me TEXT); ', null,
              (txObj,resulSet) =>{
                console.log("tabla users creada:");
              },
              (txObj, error) => console.log(error)
              );
          
            
     
             tx.executeSql('CREATE TABLE IF NOT EXISTS groups (_id TEXT PRIMARY KEY,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT); ', null,
              (txObj,resulSet) =>{
                console.log("tabla groups creada:");
              },
              (txObj, error) => console.log(error)
              );
          
    
             tx.executeSql('CREATE TABLE IF NOT EXISTS groupmessages (_id TEXT PRIMARY KEY,group TEXT, user TEXT, message TEXT, type TEXT, tipo_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT,file64 TEXT); ', null,
              (txObj,resulSet) =>{
                console.log("tabla groupmessages creada:");
               
              },
              (txObj, error) => console.log(error)
              );
          


        })


    




/*

      db.transaction( tx =>{
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (_id TEXT PRIMARY KEY,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, avatar64 TEXT,access TEXT,me TEXT); ', null,
          (txObj,resulSet) =>{
            console.log("tabla users creada:");
          },
          (txObj, error) => console.log(error)
          );
      });

      db.transaction( tx =>{
        tx.executeSql('CREATE TABLE IF NOT EXISTS groups (_id TEXT PRIMARY KEY,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT); ', null,
          (txObj,resulSet) =>{
            console.log("tabla groups creada:");
          },
          (txObj, error) => console.log(error)
          );
      });

      db.transaction( tx =>{
        tx.executeSql('CREATE TABLE IF NOT EXISTS groupmessages (_id TEXT PRIMARY KEY,group TEXT, user TEXT, message TEXT, type TEXT, tipo_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT,file64 TEXT); ', null,
          (txObj,resulSet) =>{
            console.log("tabla groupmessages creada:");
          },
          (txObj, error) => console.log(error)
          );
      });

     */
  
  
  }
//======================================================================================================================================================

  logindbx = (email, db,successCallback) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT count(*) FROM users WHERE _id=?',[email],
          (_, { rows: { _array } }) => {
            successCallback(_array);
          }
        );
      },
    );
  }


  loginLocal(email) {

    const arrUsuarios = statex$.default.user.get();

    var userFiltrado = arrUsuarios.filter(function (u) {
      return u.email == email;
    });
    
    return userFiltrado;
  }

  async cifraNIP(nip) {


    const nipCifrado = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password );
    
    return nipCifrado
  }

  async preparaRegister(email, password) {


    const hashPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password );
    //console.log("hashPassword")
    //console.log(hashPassword)
    const _id  = new Types.ObjectId();
    //==========================================================
    //console.log("generando nip")
    const min = 1000; 
    const max = 9999; 
    const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min; 

    //console.log("set nip:::::");
    //console.log(randomNumber);
    
   const nip ="A"+randomNumber
   const nipCifrado =MD5method("A"+randomNumber).toString();
   
   //console.log("nip registrado::::::::::::::::"+ nip)
   //console.log("nipCifrado registrado::::::::::::::::"+ nipCifrado)
   //================================================================

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
      const {access} = await response.json();
      //console.log("token:::::")
     // console.log(access);
      

      if (response.status !== 200) throw result;

     
      return { _id, email, hashPassword, nipCifrado, token:access,nip}

    } catch (error) {
      throw error;
    }

  }


  async registerLocal(_id, email, hashPassword,nipCifrado,token,nip) {

    const arrUsuarios = statex$.default.user.get();

    const newUser = {
      _id :_id,
      email :email,
      firstname :"",
      lastname :"",
      password :hashPassword,
      avatar :"group/group1.png",
      nip :nipCifrado,
      avatar64 :"",
      access :token,
      me :"true",
      nip:nip
    };

    statex$.default.user.set((arrUsuarios) => [...arrUsuarios, newUser]);

  }


  async registerdb(_id, email, hashPassword,nipCifrado,token,db) {

  
    
    db.transaction(tx =>{
      tx.executeSql('INSERT INTO users (_id, email, password, nip,access, me ) values (?,?,?,?,?,?,?)', [_id, email, hashPassword, nipCifrado,token,'me'],
      (txObj,resulSet) =>{
        console.log("Inserting user......");
        console.log(resulSet);
      },
      (txtObj,error)=> console.log(error),
      )
    });

   
  }

  generaNipx(){
    console.log("generando nio")
    const min = 1000; 
    const max = 9999; 
    const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min; 

    console.log("set nip:::::");
    console.log(randomNumber);
    

    console.log("NIP:::::"+"A"+randomNumber);
   // setNip("A"+randomNumber);
   const nip ="A"+randomNumber
   const cifrado =MD5method("A"+randomNumber).toString();

  // return {nip:nip,cifrado:cifrado}
   return { nip, cifrado}
  }

  /*async generatewToken(_id,email,cifrado){
    const JWT_SECRET_KEY = "0dnandrEgR7cH9Svfj8JLe4c186Ghs48hheb3902nh5DsA";

    const userStorage = {
      _id: _id, //new ObjectId("6626c7c55c8851b310d198e6"),
      email: email,
      password: cifrado,
      __v: 0
    };

    const expToken = new Date();
    expToken.setMonth(expToken.getMonth()+500);
    const payload = {
      token_type: "access",
      user_id: _id,
      iat: Date.now(),
      exp: expToken.getTime(),
    };

      return {token:jsonwebtoken.sign(payload, JWT_SECRET_KEY)};

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
//========================================================================
  async removeTokens() {
    await AsyncStorage.removeItem(ENV.JWT.ACCESS);
    await AsyncStorage.removeItem(ENV.JWT.REFRESH);
    await AsyncStorage.removeItem("initial");
  }


 

 
}
