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


async notifyRead(accessToken, idUser, idMsg) {

  try {
    console.log("idMsg enviado a notify read")
    console.log(idMsg)
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.NOTIFY_READ}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          idUser: idUser,
          idMsg: idMsg,
        }),
      };

  
      const response = await fetch(url, params);
      const resultAPI = await response.json();
       console.log("resultAPI NOTIFY_READ")
       console.log(resultAPI)

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

      //console.log("getting all messages by group");
      //console.log(resultAPI);
      EventRegister.emit("loadingEvent",false);
      if (response.status !== 200) throw resultAPI;
     
      //TODO: remove black list messages before returning
      //=================================================
      let blackList=null;
      let filteredResult=null;

      //console.log("resultAPI")
      //console.log(resultAPI)
      //console.log("Add idMessage to local black list")
      await GET_STATE_MY_DELETED_MESSAGES().then(result =>{
        blackList=result.rows._array;      
        //console.log("blackList")
        //console.log(blackList)


       const listMsgs = resultAPI.messages;
       //console.log("all messages")
       //console.log(listMsgs);

       filteredResult = listMsgs.filter(lm => 
        blackList.every(bl => bl.idMessage !== lm._id));
       
        
    }); 

    resultAPI.messages= filteredResult;

      //console.log("resultAPI")
      //console.log(resultAPI)
      return resultAPI;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      throw error;
    }
  }



  async updateVisto(accessToken, groupId) {
    try {
      
      
      console.log("groupId")
      console.log(groupId)
      const  url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_LEIDO}/${groupId}`; 
      

      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      console.log("resultAPI")
      console.log(response)

      //let resultAPI = await response.json();
      //if (response.status !== 200) throw resultAPI;
     
      return true;
    } catch (error) {
      throw error;
    }
  }

  //==============================================================================================
  async sendText(accessToken, groupId, message ,tipoCifrado, replyMessage, tipox) {

    EventRegister.emit("loadingEvent",true);
    let reenviado=false;
    //console.log("enviando msg:::::::::::::::::::::")
   // console.log(message);
   // console.log(tipoCifrado);
   // console.log(tipox);
    //cifrando msg reenviado

  if(replyMessage!=null){
   // console.log("cifrando 1")
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

      //console.log("sending...."+url);
      //console.log(params);

      const response = await fetch(url, params);
      const result = await response.json();

      //get group messages and persist
    // await selectTable('BITACORA');
    EventRegister.emit("loadingEvent",false);
      if (response.status !== 201) throw result;


      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      console.log(error);
      //console.log("Error a enviar el mensaje...")
      throw error;
    }
  }

  async sendTextForwardFile(accessToken, groupId, message ,tipoCifrado) {

    EventRegister.emit("loadingEvent",true);
  
    //console.log("reenviando file:::::::::::::::::::::")
    //console.log(message);
  
    
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

    //  console.log("sending...."+url);
     // console.log("params");
    //  console.log(params)

      const response = await fetch(url, params);
      const result = await response.json();
      //console.log(result)

      //get group messages and persist
    // await selectTable('BITACORA');
    EventRegister.emit("loadingEvent",false);
      if (response.status !== 201) throw result;


      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      console.log(error);
     // console.log("Error a enviar el file...")
      throw error;
    }
  }

  async sendTextForwardImage(accessToken, groupId, message ,tipoCifrado) {

    EventRegister.emit("loadingEvent",true);
  
    //console.log("reenviando img:::::::::::::::::::::")
    //console.log(message);
  
    
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

    //  console.log("sending...."+url);
     // console.log("params");
    //  console.log(params)

      const response = await fetch(url, params);
      const result = await response.json();
     // console.log(result)

      //get group messages and persist
    // await selectTable('BITACORA');
    EventRegister.emit("loadingEvent",false);
      if (response.status !== 201) throw result;


      return true;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      console.log(error);
      //console.log("Error a enviar el mensaje...")
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

       // console.log("sending...."+url);
       // console.log(params);

        const response = await fetch(url, params);
        const result = await response.json();

       // console.log("==========After updating====================");
       // console.log(result);

        //get group messages and persist
      // await selectTable('BITACORA');
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
          //message: Encrypt(message, tipoCifrado),
          tipo_cifrado: tipoCifrado,
          idMessage: idMessage
        }),
      };

     // console.log("sending...."+url);
     // console.log(params);

      const response = await fetch(url, params);
      const result = await response.json();

      //console.log("==========After updating====================");
      //console.log(result);

      //get group messages and persist
    // await selectTable('BITACORA');
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
      console.log("file")
      console.log(file)
      const manipulateResult = await manipulateAsync(file.uri, [], { compress: 0.1 });
      console.log("manipulateResult")
      console.log(manipulateResult)

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
        //console.log(url);

        //"Content-Type": "application/json",
        const params = {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            "accept": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        };

        //console.log(formData);

          try {
            const response = await fetch(url, params);
            //console.log(response);
            const result = await response.json();
           // console.log(result);

            EventRegister.emit("loadingEvent",false);
            if (response.status !== 201) throw result;
          } catch (error) {
           // console.log("Error al enviar imagen al grupo")
            console.log(error);
          }
      

        return true;
      } catch (error) {
       // console.log("Error general al enviar imagen al grupo")
        EventRegister.emit("loadingEvent",false);
        throw error;
      }
  }

  //=====================================================================================================
  async sendFile(accessToken, groupId, file) {

    EventRegister.emit("loadingEvent",true);
    try {
      //console.log("sending file from telephone...")
      //console.log(file);

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

      console.log("params");
      console.log(params);

    try {
          const response = await fetch(url, params);
        
          //console.log(response);
          const result = await response.json();
         // console.log("result call api file");
         // console.log(result);

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

      //  console.log("sending...."+url);
       // console.log(params);

        const response = await fetch(url, params);
        const result = await response.json();

        //console.log("==========After updating====================");
       // console.log(result);

        //get group messages and persist
      // await selectTable('BITACORA');
      EventRegister.emit("loadingEvent",false);
        if (response.status !== 201) throw result;

        return true;
      } catch (error) {
        EventRegister.emit("loadingEvent",false);
        throw error;
      }
  }


}