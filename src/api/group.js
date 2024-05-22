import { ENV } from "../utils";
import { UPDATE_STATE_ALLMESSAGES,ADD_STATE_ALLMESSAGES, GET_STATE_ALLMESSAGESBYID } from '../hooks/useDA';

export class Group {

  async create(accessToken, creatorId, usersId, name, image, llave) {

    try {

      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("creator", creatorId);
      formData.append("participants", JSON.stringify([...usersId, creatorId]));
      formData.append("tipo", llave!="" ? "cerrado":"abierto");

      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP}`;
      const params = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();
      console.log("Respuesta, id grupo creado;;;;;;;;")
      console.log(result._id)
      //let grupoCreado=result[0]._id;
      //console.log("llave")
      //console.log(llave)
      if (response.status !== 201) throw result;


      /*console.log("ADD_STATE_ALLMESSAGES, persisiendo al crear grupo")
      if(llave !=""){
        //persist locally into STATE_ALLMESSAGES table, locally by GroupId
        ADD_STATE_ALLMESSAGES( '', result._id, llave, result.tipo );
      }else{
        ADD_STATE_ALLMESSAGES( '', result._id, '', result.tipo );
      }*/

      return result;
      
    } catch (error) {
      throw error;
    }
  }

  async createAuto(accessToken, creatorId, usersId, name, image) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      //formData.append("image", image);
      formData.append("creator", creatorId);
      formData.append("participants", JSON.stringify([...usersId, creatorId]));
      formData.append("tipo","abierto");

      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUPAUTO}`;
      const params = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      console.log("creacion automatica del grupo")
      const response = await fetch(url, params);
      console.log("response creacion automatica")
      console.log(response)

      const result = await response.json();

      if (response.status !== 201) throw result;

      console.log("ADD_STATE_ALLMESSAGES, persisiendo al crear grupo auto")
      ADD_STATE_ALLMESSAGES( '', result._id, '','abierto' );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAll(accessToken) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP}`;
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

  async obtain(accessToken, groupId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP}/${groupId}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();
      console.log(groupId);
      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async exit(accessToken, groupId) {
    console.log("Saliendo del grupo:::")
    console.log(groupId)
    console.log(accessToken)
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_EXIT}/${groupId}`;
      const params = {
        method: "PATCH",
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

  async update(accessToken, groupId, data) {
    try {
      console.log("data update grupo")
      console.log(data)

      const formData = new FormData();
      if (data.file) formData.append("image", data.file);
      if (data.name) formData.append("name", data.name);

      console.log("formData update grupo")
      console.log(formData)
      //if(data.tipo=="cerrado")formData.append("tipo", data.tipo);

      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP}/${groupId}`;
      const params = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async ban(accessToken, groupId, participantId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_BAN}`;
      const params = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          group_id: groupId,
          user_id: participantId,
        }),
      };

      const repsonse = await fetch(url, params);
      const result = await repsonse.json();

      if (repsonse.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addParticipants(accessToken, groupId, participantsId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_ADD_PARTICIPANTS}/${groupId}`;
      const params = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          users_id: participantsId,
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
}