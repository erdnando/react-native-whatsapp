import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "../utils";
//import * as SQLite from 'expo-sqlite';
//import { useState } from "react";



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

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

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

  /*
  async dbCreateTables() {
    const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
    console.log('creating tables....');
  
    db.transaction( tx =>{
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (_id TEXT PRIMARY KEY,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, avatar64 TEXT) ');
      tx.executeSql('CREATE TABLE IF NOT EXISTS groups (_id TEXT PRIMARY KEY,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT); ');
      tx.executeSql('CREATE TABLE IF NOT EXISTS groupmessages (_id TEXT PRIMARY KEY,grupo TEXT, user TEXT, message TEXT, type TEXT, tipo_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT,file64 TEXT); ');
    });
  }

  dbGetUsers = (successCallback) => {
    const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from users',[],
          (_, { rows: { _array } }) => {
            successCallback(_array);
          }
        );
      },
    );
  }


  dbAddUser=(_id,email , firstname , lastname , password , avatar , nip) => {
    const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
    //setLoading(true);
    console.log('inserting.....');
  
    db.transaction(tx =>{
      tx.executeSql('INSERT INTO users (_id,email , firstname , lastname , password , avatar , nip ) values (?,?,?,?,?,?,?)', [_id,email , firstname , lastname , password , avatar , nip],
      (txObj,resulSet) =>{
        console.log("Inserted data......");
        console.log(resulSet);
  
        
      },
      (txtObj,error)=> console.log(error),
      )
    });
  } */

 
}
