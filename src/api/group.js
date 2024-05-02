import { ENV } from "../utils";
import * as statex$ from '../state/local'
//import { Groups, } from '../models/groups'
//import { Users } from '../models/users'
import { Types } from 'mongoose';
//import { useDBGroups } from '../sqlite/useDBGroups'
import { addGroup } from '../hooks/useDA'


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

      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
      const result = await response.json();

      if (response.status !== 201) throw result;

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

      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUPAUTO}`;
      const params = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      console.log("creacion automatica dle grupo")
      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
      console.log("response creacion automatica")
      console.log(response)

      const result = await response.json();

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createAutodb(creatorId, usersId, name) {
    try {
        let response=null;
        const _id = new Types.ObjectId();
      
        await addGroup(_id, creatorId, usersId, name).then(result =>{

          response=result.rows._array;
          console.log('grupo insertado')
          console.log(result)

        }).catch(error => {
          console.log(error)
        }); 

        return response==null ? 'Error al insertar' : 'insertado correctamente';
    } catch (error) {
        console.log(error)
      throw error;
    }
  }

  //obtiene todos logrupos con su detalle
  async getAllGroupsDB(email) {

        try {

          /*const groupsRef = Groups.getGroups();
          const ownerRef = Users.getUserById(gpo.creator)

          console.log("Listado de grupos")
          console.log(groupsRef)

          let arrGrupos=[];
          groupsRef.forEach( async (gpo) => { 

            const gpoDetalle = {
                                _id: gpo.id,
                                name: gpo.name,
                                image: gpo.image,
                                __v: 0,
                                last_message_date: "",
                                creator: ownerRef,
                                participants: [
                                  {
                                    "_id": "662886c9ac4a4be81cbea857",
                                    "email": "b7548672-bd45-4a08-aca9-0a325a64c34a",
                                    "password": "$2a$10$etmcymIhdmI0ETPEZU1fJuc8TmsEohlgsmGlbYmv8PMtlMScMVx8W",
                                    "__v": 0,
                                    "nip": "827ccb0eea8a706c4c34a16891f84e7b"
                                  }
                                ],
                                
                               
                              }
                              console.log("gpoDetalle")
                              console.log(gpoDetalle)

                              arrGrupos.push(gpoDetalle)
            
          });

          return arrGrupos;*/

        } catch (error) {
          throw error;
        }
}



  async getAll(accessToken) {

        //Offline validacion
        if(statex$.default.flags.offline.get()=='true'){

          console.log("getAllGrupos modo Offline!!!!!")
          const getAllRef=statex$.default.getAll.get();
          
          console.log("getAllGruposRef----------")
          console.log(getAllRef)

          return getAllRef;
        
        }else{
          console.log("getAll grupos modo on Line!!!!")
        }


    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP}`;
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
        //caching grupos
          statex$.default.getAll.set(result);
      }

      console.log("result getAll grupos")
      console.log(result)


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

      const response = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
      const result = await response.json();
      console.log(groupId);
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

      const repsonse = await fetch(url, params).catch(e=> {
        statex$.default.flags.offline.set('true');
      });
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
}