import { ENV,Encrypt,EncryptWithLlave } from "../utils";
import { EventRegister } from "react-native-event-listeners";
import * as statex$ from '../state/local';
import { manipulateAsync } from 'expo-image-manipulator';
//
import { GET_STATE_MY_DELETED_MESSAGES } from '../hooks/useDA';

export class GroupMessage {

  //=====================================================================================================
  async getTotal(accessToken, groupId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_TOTAL}/${groupId}`;
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
//=====================================================================================================
  async getGroupParticipantsTotal(accessToken, groupId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_PARTICIPANTS_TOTAL}/${groupId}`;
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
//=====================================================================================================
  async getLastMessage(accessToken, groupId) {
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_LAST}/${groupId}`;
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
//=====================================================================================================


async notifyRead(accessToken, idUser,grupoAbierto) {

  try {
   // console.log("idMsg enviado a notify read")
   // console.log(idMsg)
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.NOTIFY_READ}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          idUser: idUser,
          group_id:grupoAbierto
        }),
      };

  
      const response = await fetch(url, params);
      const resultAPI = await response.json();
      // console.log("resultAPI NOTIFY_READ")
       //console.log(resultAPI)

        if (response.status !== 201) throw resultAPI;

  } catch (error) {
     console.log(error)
    //throw error;
  }
}


  async getAll(accessToken, groupId) {
    try {
      //TODO: add to local db
      EventRegister.emit("loadingEvent",true);
     
      let fecha=statex$.default.fechaAltaGrupoSelected.get();
      console.log("fecha")
      console.log(fecha)
      const  url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_FILTERED}/${groupId}/${fecha}`; 
      

      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      let resultAPI = await response.json();

     // console.log("getting all messages by group");
     // console.log(resultAPI);
      EventRegister.emit("loadingEvent",false);
      if (response.status !== 200) throw resultAPI;
     
      //TODO: remove black list messages before returning
      //=================================================
      let blackList=null;
      let filteredResult=null;

  
      await GET_STATE_MY_DELETED_MESSAGES().then(result =>{
        blackList=result.rows._array;      
       const listMsgs = resultAPI.messages;
       filteredResult = listMsgs.filter(lm => 
        blackList.every(bl => bl.idMessage !== lm._id));
       
        
    }); 

    resultAPI.messages= filteredResult;
      return resultAPI;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      throw error;
    }
  }



  async updateVisto(accessToken, groupId) {
    try {
      
      const  url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_LEIDO}/${groupId}`; 
      
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
     
      return true;
    } catch (error) {
      throw error;
    }
  }

  //==============================================================================================
  async sendText(accessToken, groupId, message ,tipoCifrado, replyMessage, tipox) {

    EventRegister.emit("loadingEvent",true);
    let reenviado=false;

  if(replyMessage!=null){
    replyMessage.message = Encrypt(replyMessage?.message, replyMessage?.tipo_cifrado );
  }
  if(message.startsWith("reenviado::")){
    reenviado=true;
    message=message.replace("reenviado::","")
    
  }
    

  //console.log("cifrando 2")
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          group_id: groupId,
          message: Encrypt(message,tipoCifrado),
          tipo_cifrado: tipoCifrado,
          replied_message:replyMessage==null ? '' :replyMessage,
          forwarded:reenviado
        }),
      };


      const response = await fetch(url, params);
      const result = await response.json();

    EventRegister.emit("loadingEvent",false);
      if (response.status !== 201) throw result;


      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      console.log(error);
      throw error;
    }
  }

  async sendTextForwardFile(accessToken, groupId, message ,tipoCifrado) {

    EventRegister.emit("loadingEvent",true);
  
    
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_FORWARD_FILE}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          group_id: groupId,
          message: message,
          tipo_cifrado: tipoCifrado,
          replied_message:'',
          forwarded:true
        }),
      };


      const response = await fetch(url, params);
      const result = await response.json();

    EventRegister.emit("loadingEvent",false);
      if (response.status !== 201) throw result;


      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      console.log(error);
      throw error;
    }
  }

  async sendTextForwardImage(accessToken, groupId, message ,tipoCifrado) {

    EventRegister.emit("loadingEvent",true);
  
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_FORWARD_IMAGE}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          group_id: groupId,
          message: message,
          tipo_cifrado: tipoCifrado,
          replied_message:'',
          forwarded:true
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();
   
    EventRegister.emit("loadingEvent",false);
      if (response.status !== 201) throw result;


      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      console.log(error);
      throw error;
    }
  }
  //==============================================================================================
  async sendTextEditado(accessToken, groupId, message,tipoCifrado,idMessage, tipox) {
    
      EventRegister.emit("loadingEvent",true);
      try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_EDIT}`;
        const params = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            group_id: groupId,
            message: Encrypt(message,tipoCifrado),
            tipo_cifrado: tipoCifrado,
            idMessage: idMessage
          }),
        };

        const response = await fetch(url, params);
        const result = await response.json();

      EventRegister.emit("loadingEvent",false);
        if (response.status !== 201) throw result;

        return true;
      } catch (error) {
        EventRegister.emit("loadingEvent",false);
        throw error;
      }
  }

  //====================================================================================================
  async deleteMessage(accessToken, groupId, message,tipoCifrado,idMessage) {
  
    EventRegister.emit("loadingEvent",true);
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_DELETE}`;
      const params = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          group_id: groupId,
          message: Encrypt(message, tipoCifrado),
          tipo_cifrado: tipoCifrado,
          idMessage: idMessage
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

    EventRegister.emit("loadingEvent",false);
      if (response.status !== 201) throw result;

      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      throw error;
    }
  }
    
  //=====================================================================================================
  async sendImage(accessToken, groupId, file) {

      EventRegister.emit("loadingEvent",true);
    
      const manipulateResult = await manipulateAsync(file.uri, [], { compress: 0.1 });

      const filex = {
        name:file.name,
        type:file.type,
        uri: manipulateResult.uri,

      }
  
      try {
        const formData = new FormData();
        formData.append("group_id", groupId);
        formData.append("image", filex);//file
      

        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_IMAGE}`;
     
        const params = {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            "accept": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        };

          try {
            const response = await fetch(url, params);
            const result = await response.json();

            EventRegister.emit("loadingEvent",false);
            if (response.status !== 201) throw result;
          } catch (error) {
            console.log(error);
          }
      

        return true;
      } catch (error) {
        EventRegister.emit("loadingEvent",false);
        throw error;
      }
  }

  //=====================================================================================================
  async sendFile(accessToken, groupId, file) {

    EventRegister.emit("loadingEvent",true);
    try {

      const formData = new FormData();
      formData.append("group_id", groupId);
      formData.append("file", file);

      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_FILE}`;
     
      const params = {
        method: "POST",
        headers: {
          "content-type": "multipart/form-data",
          "accept": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

    try {
          const response = await fetch(url, params);
          const result = await response.json();

          EventRegister.emit("loadingEvent",false);
          if (response.status !== 201) throw result;

    } catch (error) {
      console.log("Error al enviar archivo al grupo")
      console.log(error);
    }
    
    
      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      throw error;
    }
  }
    //=====================================================================================================

  //====================================================================================================
  async updateCifrados(accessToken, groupId, message,tipoCifrado,idMessage, tipox, nuevaLlaveG) {
 
    EventRegister.emit("loadingEvent",true);
      try {
        const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_CRYPT}`;
        const params = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            group_id: groupId,
            message: EncryptWithLlave(message,tipoCifrado, nuevaLlaveG),
            tipo_cifrado: tipoCifrado,
            idMessage: idMessage
          }),
        };

        const response = await fetch(url, params);
        const result = await response.json();

      EventRegister.emit("loadingEvent",false);
        if (response.status !== 201) throw result;

        return true;
      } catch (error) {
        EventRegister.emit("loadingEvent",false);
        throw error;
      }
  }


}