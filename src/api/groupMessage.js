import { ENV,Encrypt,Decrypt } from "../utils";
import { EventRegister } from "react-native-event-listeners";
import { useState, useEffect, useCallback } from "react";
import * as statex$ from '../state/local'
import { findAllGrupoMessages, deleteMessageById,updateMessage } from '../hooks/useDA'
import { Types } from 'mongoose';
import { addMessage } from '../hooks/useDA'
import * as Crypto from 'expo-crypto';


export class GroupMessage {

 
  /*async getAllLocal(groupId) {
 
     EventRegister.emit("loadingEvent",true);
 
     const arrGpoMsgs = statex$.default.messages.get();
     //console.log("arrGpoMsgs:::::::::")
     //console.log(arrGpoMsgs)
     const arrUsers = statex$.default.users.get();
     let arrMessages=[];

 
     const lstMessages = arrGpoMsgs.filter(function (gm) {
 
       return gm.group.toString() == groupId;
     });
 
       //1.- Recorre lista de grupos
       lstMessages.forEach( (gm) => {
 
               const userMessage = (arrUsers).filter(function (u) {
                 return u.email == gm.user?.email;
               });
 
             // console.log("userMessage")
         //  console.log(userMessage[0])
 //// Encrypt(gm.message,gm.tipo_cifrado ), 
               const newMessage={
                 _id: gm._id,
                 grupo: gm.group,
                 user: userMessage[0],
                 message: gm.message,     //<-------------validate if it need to be crypted!!!!!
                 message_replied:gm.message_replied,
                 email_replied:gm.email_replied,
                 tipo_cifrado_replied:gm.tipo_cifrado_replied,
                 type: gm.type,
                 tipo_cifrado: gm.tipo_cifrado,
                 forwarded: gm.forwarded,
                 createdAt: gm.createdAt,
                 updatedAt: gm.updatedAt,
                 __v: 0
               };
 
               arrMessages.push(newMessage)
 
       });
 
     const resultado ={
       "messages": arrMessages,
       "total": arrMessages.length
     }

     console.log("getAllLocal")
     console.log(resultado)
 
     EventRegister.emit("loadingEvent",false);
     return resultado;
   }
 }*/
  
 async getAllGroupMessage() {
   //addMessage
    try {
           let response=null;
           await findAllGrupoMessages().then(result =>{
            response=result.rows._array
            
           }); 

           console.log("getAllGroupMessage")
           console.log(response)

           return response;
      } catch (error) {
       // console.log(error)
        throw error;
      }
    }
 
  //=====================================================================================================
  async getTotal(accessToken, groupId) {

    //====================================================================


    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_TOTAL}/${groupId}`;
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

  async getTotalLocal(groupId) {

    const arrGroupMessages = statex$.default.messages.get();

    const gpoMsgsFiltrado = arrGroupMessages.filter(function (gm) {
      return gm.group == groupId;
    });

    return gpoMsgsFiltrado.length;

    
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

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw result;
    

      return result;

    } catch (error) {
      throw error;
    }
  }
  
  async getGroupParticipantsTotalLocal(groupId) {

    const arrGroups = statex$.default.groups.get();

    const gpo = arrGroups.filter(function (p) {
      return p._id == groupId;
    });

    
    return gpo[0].participants.length;
   
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

      const response = await fetch(url, params)
      const result = await response.json();

      if (response.status !== 200) throw result;

      console.log("result lastMessage")
      console.log(result)
      

      return result;
    } catch (error) {
      throw error;
    }
  }
//=====================================================================================================
  /*async getAll(accessToken, groupId) {

   

    try {
     EventRegister.emit("loadingEvent",true);
      console.log('1')
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE}/${groupId}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params)
      const result = await response.json();

      console.log("getting all messages by group");
      console.log(result);
      EventRegister.emit("loadingEvent",false);
      console.log('2')
      if (response.status !== 200) throw result;
      
      
     
      return result;
    } catch (error) {
      EventRegister.emit("loadingEvent",false);
      throw error;
    }
}*/

async getAllLocalDB(groupId) {
  // console.log("getAllLocal groupId")
  // console.log(groupId)

   EventRegister.emit("loadingEvent",true);

   const arrGpoMsgs = statex$.default.messages.get();
   console.log("listado de mensajes del grupo:::::::::")
   console.log(arrGpoMsgs)
   console.log("groupId")
   console.log(groupId)
   const arrUsers = statex$.default.users.get();
   let arrMessages=[];


   const lstMessages = arrGpoMsgs.filter(function (gm) {

     return gm?.grupo == groupId;
   });

   console.log("coincidencias group:::::::::::::::")
   console.log(lstMessages)
  

     //1.- Recorre lista de grupos
     lstMessages.forEach( (gm) => {

             const userMessage = (arrUsers).filter(function (u) {
               return u.email == gm.user?.email;
             });

  
             const newMessage={
               _id: gm._id,
               grupo: gm.grupo,  //<-------------------------group or grupo
               user: userMessage[0],
               message: gm.message, 
               message_replied:gm.message_replied,
               email_replied:gm.email_replied,
               tipo_cifrado_replied:gm.tipo_cifrado_replied,
               type: gm.type,
               tipo_cifrado: gm.tipo_cifrado,
               forwarded: gm.forwarded,
               createdAt: gm.createdAt,
               updatedAt: gm.updatedAt,
               __v: 0
             };

             arrMessages.push(newMessage)

     });


   const resultado ={
     "messages": arrMessages,
     "total": arrMessages.length
   }

   EventRegister.emit("loadingEvent",false);

   console.log("getAllLocalDB:::")
   console.log(resultado)

   return resultado;
 
 }

//==============================================================================================

async sendTextLocal(accessToken, groupId, message ,tipoCifrado, replyMessage,idAPPEmail,gpoDestino) {

  //accessToken, msgx._id, "reenviado::"+forwardMessage.message ,forwardMessage.tipo_cifrado, null,email


  console.log("message TEXT::::::::::::::::::::::::::::::::")
  console.log(groupId)
  console.log(message)
  console.log(tipoCifrado)
  console.log(replyMessage)
  console.log(idAPPEmail)
  console.log("---------------------------------------------")
  EventRegister.emit("loadingEvent",true);
    let reenviado=false;
    
    console.log("Enviando mensajes de texto");
    console.log("tiene replyMessage?");
    console.log(replyMessage);

 
    //REPLAYING CASE
    if(replyMessage!=null){

        console.log("replyMessage::::::::::::::::::::::::::::::::::::::::::::::::::")
        console.log(replyMessage)
        //cifrando msg reenviado
        replyMessage.message = Encrypt(replyMessage?.message,replyMessage?.tipo_cifrado );

    }
    //FORWARDING CASE
    if(message.startsWith("reenviado::")){

        console.log("reenviando msg:::::::::::::::::::::")
        reenviado=true;
        message=message.replace("reenviado::","")
        

    }
  
    
    const arrUsers = statex$.default.users.get();

    const userFiltrado = arrUsers.filter(function (c) {
      return c.email == idAPPEmail;
    });

    //console.log("cifrando 2")
    const _id = new Types.ObjectId();
    const today = new Date().toISOString()
    //Creating groupMessage
    const newGpoMessage={
      _id  :_id.toString(),
      grupo  :groupId, //grupo al q pertenece el mensaje
      user  :userFiltrado[0], 
      message  : Encrypt(message,tipoCifrado), //se envia cifrado el mensaje, Siempre!!!!!!
      type  :"TEXT", 
      tipo_cifrado  :tipoCifrado, 
      message_replied:replyMessage==null ? null :replyMessage?.message,
      email_replied:replyMessage==null ? null :replyMessage?.user.email,
      tipo_cifrado_replied:replyMessage==null ? null :replyMessage?.tipo_cifrado,
      forwarded:reenviado,
      createdAt  :today, 
      updatedAt  :today,
      file64  :"",
      grupoDestino  :gpoDestino
      };

      
      console.log("msg, antes de enviar")
      console.log("============original=====================")
      console.log(newGpoMessage)
      console.log("============stringify=====================")
      console.log(JSON.stringify(newGpoMessage))

      //Anadiedno al estado el nuevo mensaje
      //Valida si solo se anade , hasta q se recibe!!!!!!
   
        try {
              const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_LOCAL}`;
              const params = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(newGpoMessage),
              };

              const response = await fetch(url, params);
              const result = await response.json();

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



/*async sendText(accessToken, groupId, message ,tipoCifrado, replyMessage) {

  EventRegister.emit("loadingEvent",true);
  let reenviado=false;
   console.log("reenviando msg:::::::::::::::::::::")
  console.log(message);
  console.log(tipoCifrado);
  //cifrando msg reenviado
if(replyMessage!=null){
  console.log("cifrando 3")
  replyMessage.message = Encrypt(replyMessage?.message,replyMessage?.tipo_cifrado );
}
if(message.startsWith("reenviado::")){
  reenviado=true;
  message=message.replace("reenviado::","")
  
}
  

console.log("cifrando 4")
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

    const response = await fetch(url, params)
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
}*/
//==============================================================================================
  /*async sendTextEditado(accessToken, groupId, message,tipoCifrado,idMessage) {
    console.log("cifrando 5")
    EventRegister.emit("loadingEvent",true);
    console.log('3')

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

      const response = await fetch(url, params)
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
  }*/

  async sendTextEditadoLocal(accessToken, groupId, message,tipoCifrado,idMessage,idAPPEmail) {
    //console.log("cifrando 3")
    EventRegister.emit("loadingEvent",true);

  
    //call out to reload local message list in each group member
    try {
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_EDIT_LOCAL}`;
      const params = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          group_id: groupId,
          idMessage: idMessage,
          message: Encrypt(message,tipoCifrado),
          tipo_cifrado: tipoCifrado,
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
  console.log("cifrando 6")
  EventRegister.emit("loadingEvent",true);
  console.log('4')
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

    const response = await fetch(url, params)
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


async deleteMessageLocal(idMessage) {

   try {
           let response=null;
           await deleteMessageById(idMessage).then(result =>{
            console.log("deleteMessageById")
            console.log(result)


            //delete locally-------------------------------------------------
            const arrGpoMessages = statex$.default.messages.get();
            const arrMessagesDepurated = arrGpoMessages.filter(function (gm) {
              return gm._id != idMessage;
            });
            statex$.default.messages.set(arrMessagesDepurated);
            //---------------------------------------------------------------

            //
            EventRegister.emit("reloadMessages","SI");
            return true;
            
           }); 


           return true;
      } catch (error) {
        console.log("error al borrar mensaje")
        console.log(error)
        throw error;
      }
}
  
//=====================================================================================================
  async sendImage(accessToken, groupId, file) {

   EventRegister.emit("loadingEvent",true);
    console.log('5')
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
          const response = await fetch(url, params)
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
  console.log('6')
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
    const response = await fetch(url, params)
   
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

  async guardaMessage(newMessage) {
    try {
        let response=null;
        const today = new Date().toISOString()
        
      
        await addMessage(newMessage._id, newMessage.group, newMessage.user._id, newMessage.message,newMessage.type,newMessage.tipo_cifrado,newMessage.forwarded, today   ).then(result =>{

          response=result.rows._array;
          console.log('mensaje insertado')
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

  async updateMessage(editedMssage) {
    try {
        let response=null;
        const today = new Date().toISOString()
        
      
        await updateMessage(editedMssage._id, editedMssage.message,editedMssage.tipo_cifrado, today   ).then(result =>{

          response=result.rows._array;
          console.log('mensaje updated')
          console.log(result)

        }).catch(error => {
          console.log(error)
        }); 

        return response==null ? 'Error al actualizar' : 'actualizado correctamente';
    } catch (error) {
        console.log(error)
      throw error;
    }
  }

}