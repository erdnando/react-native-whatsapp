import { ENV } from "../utils";
import * as statex$ from '../state/local.js'
import * as Crypto from 'expo-crypto';

export class User {

  //==========================================================================================
  async getMe(accessToken) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.ME}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getMeLocal(idAPPEmail) {


    const arrUsuarios = statex$.default.user.get();

    var userFiltrado = arrUsuarios.filter(function (u) {
      return u.email == idAPPEmail;
    });
    
    return userFiltrado[0];

   
    /*try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.ME}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }*/
  }
//==========================================================================================

async updateUserLocal(idAPPEmail, userData) {

  const arrUsers = statex$.default.user.get();


  const arrUsersUpdated = arrUsers.map(p =>
    p.email === idAPPEmail
      ? { ...p, name: userData }
      : p
  );

  statex$.default.user.set(arrUsersUpdated);

  console.log("Updating user")
  console.log(statex$.default.user.get());
  
  
}

async updateUserNIPLocal(idAPPEmail, userData) {
     // console.log("nip recibido")
     // console.log(userData)

      const arrUsers = statex$.default.user.get();

      const arrUsersUpdated = arrUsers.map(n =>
        n.email === idAPPEmail
          ? { ...n, nip: userData }
          : n
      );

      statex$.default.user.set(arrUsersUpdated);
      //============================================
     // console.log("=========Updating NIP ====================")
     // console.log(statex$.default.user.get());
      //console.log("==========================================")

      //get nip hashed
      const nipCifrado = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, userData );
      const arrUsers2 = statex$.default.user.get();
      const arrUsersUpdatedNIP = arrUsers2.map(p =>
        p.email === idAPPEmail
          ? { ...p, password: nipCifrado }
          : p
      );

      statex$.default.user.set(arrUsersUpdatedNIP);
      //============================================

      //console.log("=========Updating password================")
      //console.log(statex$.default.user.get());
      //console.log("==========================================")
}

  async updateUser(accessToken, userData) {
    console.log("Actualizando::::::::::::::::;");
    console.log("===================");
    console.log("userData");
    console.log(userData);
    
    try {
      const data = userData;

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      console.log("formData");
      console.log(formData);
      
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.ME}`;

      const params = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      console.log("params");
      console.log(params);
      const response = await fetch(url, params);
      const result = await response.json();

      console.log("result");
      console.log(result);

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
//==========================================================================================
  async getAll(accessToken) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
//=========================================================================
   getAllLocaL(idAPPEmail) {
    //getUser

    const arrUsers = statex$.default.user.get();

    var userFiltrado = arrUsers.filter(function (u) {
      return u.email == idAPPEmail;
    });
    
    return userFiltrado;

  }
//==========================================================================================
  async getUser(accessToken, userId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  //==========================================================================================
  async getUsersExeptParticipantsGroup(accessToken, groupId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER_EXCEPT_PARTICIPANTS_GROUP}/${groupId}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw error;

      return result;
    } catch (error) {
      throw error;
    }
  }
  //==========================================================================================
}
