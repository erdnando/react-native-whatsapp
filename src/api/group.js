import { ENV } from "../utils";
import * as statex$ from '../state/local'
import { Types } from 'mongoose';
import { addGroup,findUsersByEmail,findAllUsers, findAllGroups } from '../hooks/useDA'
import * as Crypto from 'expo-crypto';

export class Group {

  async getAllGroups() {
   
    try {
           let response=null;
           await findAllGroups().then(result =>{
            response=result.rows._array
           }); 

           return response;
      } catch (error) {
       // console.log(error)
        throw error;
      }
  }

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
        
      });
      const result = await response.json();

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createlocal(accessToken, creatorId, usersId, name, image) {
    
    try {
      let response=null;
      const _id = new Types.ObjectId();
      const today = new Date().toISOString()
      const arrParticipantes= JSON.stringify([usersId]);
    
      //adding to DB
      await addGroup(_id.toString() , creatorId, arrParticipantes, name, today).then(result =>{

        response=result.rows._array;
        console.log('grupo insertado por opcion')
        console.log("id del nuevo grupo:")
        console.log(_id.toString())
        console.log(result)

        //add to state managment
        const arrGroups = statex$.default.groups.get();

        const newGrupo = {
          _id :  _id.toString(),
          name  : name, 
          participants  :arrParticipantes, 
          creator  : creatorId, 
          image  : "group/group1.png", 
          image64  : ""
        };
        console.log("Adding to state")
        statex$.default.groups.set((arrGroups) => [...arrGroups, newGrupo]);

      }).catch(error => {
        console.log("Error al crear el grupo")
        console.log(error)
      }); 

      return response==null ? 'Error al insertar' : 'insertado correctamente';
  } catch (error) {
      console.log(error)
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
        const today = new Date().toISOString()
        const arrParticipantes= JSON.stringify([usersId]);
      
        await addGroup(_id.toString() , creatorId, arrParticipantes, name, today).then(result =>{

          response=result.rows._array;
          console.log('grupo insertado en nueva implementacion')
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
  async getAllGroupsLocal(email) {

   console.log("Obteniendo grupos donde participa::::::")
   console.log(email)

    const arrGroups = statex$.default.groups.get();
    const arrUsers = statex$.default.users.get();

    let gruposDondeParticipa=[];
    console.log("arrGroups--------->")
    console.log(arrGroups)


    //1.- Recorre lista de grupos
    arrGroups.forEach( (grupo) => {
     
          //2.- Por cada grupo, busca en su lista de participantes coincidencia
          const participantesx = JSON.parse(grupo.participants);

            const creatorx = arrUsers.filter(function (c) {
              return c.email == email;
            });

            const participantes = grupo.participants;
            console.log("participantes:::::::::::::::::::::::::::si son 0 validar!!!!")
            console.log(participantes)

            let bcontinua=false;
            participantesx.forEach((element) => {
              console.log("validando participantes")
              console.log(element)
              console.log(email)
              console.log(email==element)
              if(element == email){
                bcontinua=true;
              }
            })

            if(bcontinua){

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

      console.log("gruposDondeParticipa::::::::::::::::::::")
      console.log(gruposDondeParticipa)
    return gruposDondeParticipa;
  }




  async getAll(accessToken) {


    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw result;

      

      console.log("result getAll grupos")
      console.log(result)


      return result;
    } catch (error) {
      throw error;
    }
  }

  async obtainLocal(groupId) {
    const arrGroups = statex$.default.groups.get();
    const groupRef = arrGroups.filter(function (g) {
      return g._id == groupId;
    });

    //console.log("obtain local")
    //console.log(groupRef[0])
    return groupRef[0];
  }

  async obtain(accessToken, groupId) {
    try {
      //groupId=JSON.parse(groupId)
      console.log("invocando api group::::::::::")
      console.log(groupId)
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP}/${groupId}`; //<----------------------
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params).catch(e=> {
        
      });
      const result = await response.json();
      console.log(groupId);
      if (response.status !== 200) throw result;


//get groupRef


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
        
      });
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
}