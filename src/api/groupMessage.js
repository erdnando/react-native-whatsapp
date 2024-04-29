import { ENV,Encrypt,Decrypt } from "../utils";
import { EventRegister } from "react-native-event-listeners";
//import { useDB } from "../hooks";
import { useState, useEffect, useCallback } from "react";

//const { createTable,addUser , selectTable,deleteTable } = useDB();

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
  async getAll(accessToken, groupId) {
    try {
      EventRegister.emit("loadingEvent",true);
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE}/${groupId}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      //console.log("getting all messages by group");
      //console.log(result);
      EventRegister.emit("loadingEvent",false);
      if (response.status !== 200) throw result;
     
      return result;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      throw error;
    }
  }

//==============================================================================================
async sendText(accessToken, groupId, message ,tipoCifrado, replyMessage) {

  EventRegister.emit("loadingEvent",true);
  let reenviado=false;
   console.log("reenviando msg:::::::::::::::::::::")
  console.log(message);
  console.log(tipoCifrado);
  //cifrando msg reenviado
if(replyMessage!=null){
  console.log("cifrando 1")
  replyMessage.message = Encrypt(replyMessage?.message,replyMessage?.tipo_cifrado );
}
if(message.startsWith("reenviado::")){
  reenviado=true;
  message=message.replace("reenviado::","")
  
}
  

console.log("cifrando 2")
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

    console.log("sending...."+url);
    console.log(params);

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
    console.log("Error a enviar el mensaje...")
    throw error;
  }
}
//==============================================================================================
  async sendTextEditado(accessToken, groupId, message,tipoCifrado,idMessage) {
    console.log("cifrando 3")
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

      console.log("sending...."+url);
      console.log(params);

      const response = await fetch(url, params);
      const result = await response.json();

      console.log("==========After updating====================");
      console.log(result);

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
  console.log("cifrando 4")
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
        message: Encrypt(message,tipoCifrado),
        tipo_cifrado: tipoCifrado,
        idMessage: idMessage
      }),
    };

    console.log("sending...."+url);
    console.log(params);

    const response = await fetch(url, params);
    const result = await response.json();

    console.log("==========After updating====================");
    console.log(result);

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
    try {
      const formData = new FormData();
      formData.append("group_id", groupId);
      formData.append("image", file);

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
          console.log(result);

          EventRegister.emit("loadingEvent",false);
          if (response.status !== 201) throw result;
        } catch (error) {
          console.log("Error al enviar imagen al grupo")
          console.log(error);
        }
     

      return true;
    } catch (error) {
      console.log("Error general al enviar imagen al grupo")
       EventRegister.emit("loadingEvent",false);
      throw error;
    }
  }


//=====================================================================================================
async sendFile(accessToken, groupId, file) {

  EventRegister.emit("loadingEvent",true);
  try {
    console.log("sending file from telephone...")
    console.log(file);

    const formData = new FormData();
    formData.append("group_id", groupId);
    formData.append("file", file);

    const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_FILE}`;
    console.log(url);

    //"Content-Type": "application/json",
    //multipart/form-data
    //"Content-Type": file.type,
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
    console.log("result call api file");
    console.log(result);

    EventRegister.emit("loadingEvent",false);
    if (response.status !== 201) throw result;
  } catch (error) {
    console.log("Error al enviar imagen al grupo")
    console.log(error);
  }
   
  
    return true;
  } catch (error) {
    EventRegister.emit("loadingEvent",false);
    throw error;
  }
}
  //=====================================================================================================



}