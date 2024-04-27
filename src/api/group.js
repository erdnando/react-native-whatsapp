import { ENV } from "../utils";
import * as SQLite from 'expo-sqlite';
import * as statex$ from '../state/local.js'
import { Types } from 'mongoose';
import { array } from "yup";

export class Group {

  async create(accessToken, creatorId, usersId, name, image) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("creator", creatorId);
      formData.append("participants", JSON.stringify([...usersId, creatorId]));

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

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }


  //createGpoLocal(idAPPEmail, user._id, usersId, name,image)
  async createGpoLocal(idAPPEmail, creatorId, usersId, name) {
    //console.log("creando grupo local ::::::::::::::::::::::::::::::")
    //console.log(idAPPEmail)
    //console.log(creatorId)
    //console.log(usersId)
    //console.log(name)
    //console.log("::::::::::::::::::::::::::::::")

    const arrGroups = statex$.default.groups.get();
    const arrUsers = statex$.default.user.get();

    const participante1 = arrUsers.filter(function (c) {
      return c.email == idAPPEmail;
    });

    const newGrupo = {
      _id :  new Types.ObjectId(),
      name  : name, 
      participants  :participante1, 
      creator  : creatorId, 
      image  : "group/group1.png", 
      image64  : ""
    };

    statex$.default.groups.set((arrGroups) => [...arrGroups, newGrupo]);
  }

  async createAuto(accessToken, creatorId, usersId, name, image) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      //formData.append("image", image);
      formData.append("creator", creatorId);
      formData.append("participants", JSON.stringify([...usersId, creatorId]));

      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUPAUTO}`;
      const params = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createAutodb(creatorId, usersId, name, db) {

   
    //groups (_id TEXT PRIMARY KEY,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT)
    const participantes=[usersId];
    
    db.transaction(tx =>{
      tx.executeSql('INSERT INTO groups (_id, name , participants , creator , image , image64  ) values (?,?,?,?,?,?)', [_id, name, JSON.stringify(participantes), creatorId,'group/group1.png',''],
      (txObj,resulSet) =>{
        //console.log("Inserting user......");
        //console.log(resulSet);

      },
      (txtObj,error)=> console.log(error),
      )
    });

  
  }

  async createAutoLocal(creatorId, usersId, name,participante1) {

   
    const arrGroups = statex$.default.groups.get();

    const newGrupo = {
      _id :  new Types.ObjectId(),
      name  : name, 
      participants  :participante1, 
      creator  : creatorId, 
      image  : "group/group1.png", 
      image64  : ""
    };

    statex$.default.groups.set((arrGroups) => [...arrGroups, newGrupo]);

  
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

  getAllLocal(idAPPEmail) {

    //console.log("ARMANDO JSON ALL GROUPS:::::::::::::::::::::::::::");
    //console.log("idAPPEmail");
    //console.log(idAPPEmail);
    //console.log("estado final");
    //console.log("USUARIOS:::::::::::::::::::::::::::");
    //console.log(statex$.default.user.get());
    //console.log("GRUPOS:::::::::::::::::::::::::::");
    //console.log(statex$.default.groups.get());

    //a20b82e7-a35f-4de1-9eb9-3c4ac26432f2
    const arrGroups = statex$.default.groups.get();
    const arrUsers = statex$.default.user.get();

    let gruposDondeParticipa=[];


    //1.- Recorre lista de grupos
    arrGroups.forEach( (grupo) => {

      //console.log("participants:::" + grupo.name)
      //console.log(grupo.participants)



      //2.- Por cada grupo, busca en su lista de participantes coincidencia
     const arrP = (grupo.participants).filter(function (p) {
        return p.email == idAPPEmail;
      });

      if(arrP.length>0){
        //console.log("Participante encontrado:::")
        //console.log(arrP)

        const creatorx = arrUsers.filter(function (c) {
          return c.email == idAPPEmail;
        });

        //console.log("creator")
        //console.log(creatorx)

        const participantes = grupo.participants;
        //console.log("participantes")
        //console.log(participantes)
        //grupo
        //creator

        const newGpoRespuesta={
          _id: grupo._id,
          name: grupo.name,
          participants: participantes,
          creator: creatorx[0],
          image: "group/group1.png",
          __v: 0,
          last_message_date: null
        };

        gruposDondeParticipa.push(newGpoRespuesta)
      }

    });

     // console.log("gruposDondeParticipa::::::::::::::::::::")
    //  console.log(gruposDondeParticipa)
    return gruposDondeParticipa;

    
  }

  //==================================================================================================================

  async obtainGpoLocal(idAPPEmail, groupId) {
   
    const arrGroups = statex$.default.groups.get();
   // const arrUsers = statex$.default.user.get();

   const arrGpofiltrado = (arrGroups).filter(function (p) {
    return p._id == groupId;
  });

  //console.log("arrGpofiltrado:::::")
  //console.log(arrGpofiltrado)

   return arrGpofiltrado[0];
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
      //console.log(groupId);
      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async exit(accessToken, groupId) {
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
      const formData = new FormData();
      if (data.file) formData.append("image", data.file);
      if (data.name) formData.append("name", data.name);

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
