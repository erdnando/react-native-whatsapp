import { ENV } from "../utils";
import * as statex$ from '../state/local'

export class User {

  //==========================================================================================
  async getMe(accessToken) {
   
    //Offline validacion
   if(statex$.default.flags.offline.get()=='true'){

        console.log("modo Offline!!!!!")

        const getMeRef=statex$.default.getMe.get();

        if(getMeRef._id !=""){
          return getMeRef;
        }else{
          return {"__v": 0, "_id": "", "email": "", "nip": ""}
        }
      
    }else{
      console.log("modo on Line!!!!!")
    }





    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.ME}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
      const result = await response.json();

      if (response.status !== 200) throw result;

      //Offline cache
      if (response.status == 200){
          const newGetMe={"__v": 0, "_id": result._id, "email": result.email, "nip": result.nip}
            statex$.default.getMe.set(newGetMe);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
//==========================================================================================
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
      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
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

  async getAllUsers(accessToken) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER_ALL}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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

  async getAllUsersLocal() {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER_ALL}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
//==========================================================================================
  async getUser(accessToken, userId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER}/${userId}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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

  //==========================================================================================
  async getUsersExeptParticipantsGroup(accessToken, groupId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.USER_EXCEPT_PARTICIPANTS_GROUP}/${groupId}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
      const result = await response.json();

      if (response.status !== 200) throw error;

      return result;
    } catch (error) {
      throw error;
    }
  }
  //==========================================================================================
}