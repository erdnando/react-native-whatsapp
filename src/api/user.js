import { ENV } from "../utils";
import * as statex$ from '../state/local'
import { updateNip,updateAlias } from '../hooks/useDA.js'

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

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw result;

     

      return result;
    } catch (error) {
      throw error;
    }
  }
//==========================================================================================
async updateUserNipDB(email, userData) {

  const data = userData;

  console.log(data)

  updateNip(data.nipraw,data.nip,email)
}

async updateUserAliasDB(email, userData) {

  const data = userData;

  updateAlias(data.firstname, email)
}

/*async updateUser(accessToken, userData) {
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
      const response = await fetch(url, params)
      const result = await response.json();

      console.log("result");
      console.log(result);

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }*/
//==========================================================================================
  async getAll(accessToken) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(accessToken) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER_ALL}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsersLocal() {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER_ALL}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
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

      const response = await fetch(url, params)
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

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw error;

      return result;
    } catch (error) {
      throw error;
    }
  }
  //==========================================================================================
}