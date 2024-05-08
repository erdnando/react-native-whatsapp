import { ENV,Encrypt,Decrypt } from "../utils";
import { EventRegister } from "react-native-event-listeners";
import { useState, useEffect, useCallback } from "react";
import * as statex$ from '../state/local'
import { findAllGrupoMessages, deleteMessageById,updateMessage } from '../hooks/useDA'
import { Types } from 'mongoose';
import { addMessage } from '../hooks/useDA'
import * as Crypto from 'expo-crypto';


export class GroupMessage {

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
      console.log("arrUsers")
      console.log(arrUsers)

      let arrMessages=[];


      const lstMessages = arrGpoMsgs.filter(function (gm) {

        return gm?.grupo == groupId;
      });

      console.log("coincidencias group:::::::::::::::")
      console.log(lstMessages)
      

        //1.- Recorre lista de grupos
        lstMessages.forEach( (gm) => {

          console.log("gm.user?.email")
          console.log(gm.user?.email)

          let userMessage =[];
          if(gm.user?.email==undefined){

            userMessage = (arrUsers).filter(function (u) {
              return u._id == gm.user;
            });

          }else{

            userMessage = (arrUsers).filter(function (u) {
              return u.email == gm.user?.email;
            });

          }
                

                console.log("userMessage")
                console.log(userMessage)
                console.log("gm.id_message_replied")
                console.log(gm.id_message_replied)

      
                const newMessage={
                  _id: gm._id,
                  grupo: gm.grupo,  //<-------------------------group or grupo
                  user: userMessage[0],
                  message: gm.message, 
                  id_message_replied:gm.id_message_replied==undefined?null:gm.id_message_replied,
                  message_replied:gm.message_replied==undefined?null:gm.message_replied,
                  email_replied:gm.email_replied==undefined?null:gm.email_replied,
                  tipo_cifrado_replied:gm.tipo_cifrado_replied==undefined?null:gm.tipo_cifrado_replied,
                  tipo: gm.tipo,
                  tipo_cifrado: gm.tipo_cifrado,
                  forwarded: gm.forwarded,
                  createdat: gm.createdat,
                  updatedat: gm.updatedat,
                  file_name: gm.file_name=undefined?null:gm.file_name,
                  file_type: gm.file_type=undefined?null:gm.file_type,
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
      //console.log(resultado)

      return resultado;
    
    }

    //==============================================================================================

    async sendTextLocal(accessToken, groupId, message ,tipoCifrado, replyMessage,idAPPEmail,gpoDestino) {


        console.log("message TEXT::::::::::::::::::::::::::::::::")
        console.log(groupId)
        console.log(message)
        console.log(tipoCifrado)
        console.log(replyMessage)
        console.log(idAPPEmail)
        console.log("---------------------------------------------")

        EventRegister.emit("loadingEvent",true);
        let reenviado="false";
        
        console.log("Enviando mensajes de texto");
        console.log("tiene replyMessage?");
        console.log(replyMessage);

    
        //REPLAYING CASE
        if(replyMessage!=null){

            console.log("replyMessage::::::::::::::::::::::::::::::::::::::::::::::::::")
            console.log(replyMessage)


            if(replyMessage.tipo=="IMAGE"){
              replyMessage.message = replyMessage._id+".png";
            }
            if(replyMessage.tipo=="FILE"){
              replyMessage.message = replyMessage.file_name;
            }
            //cifrando msg reenviado
            replyMessage.message = Encrypt(replyMessage?.message , replyMessage?.tipo_cifrado );
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

        //Creating new groupMessage
        const newGpoMessage={
          _id  :_id.toString(),
          grupo  :groupId, //grupo al q pertenece el mensaje
          user  :userFiltrado[0], 
          message  : Encrypt(message,tipoCifrado), //se envia cifrado el mensaje, Siempre!!!!!!
          tipo  :"TEXT", 
          tipo_cifrado  :tipoCifrado, 
          id_message_replied:replyMessage==null ? null :replyMessage?._id,
          message_replied:replyMessage==null ? null :replyMessage?.message,
          email_replied:replyMessage==null ? null :replyMessage?.user.email,
          tipo_cifrado_replied:replyMessage==null ? null :replyMessage?.tipo_cifrado,
          forwarded:reenviado,
          createdat  :today, 
          updatedat  :today,
          image64  :"",
          grupoDestino  :gpoDestino
          };

          
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

    async sendImageLocal(accessToken, groupId, file, email,image64) {

        EventRegister.emit("loadingEvent",true);
        try {

          //============preparing image package=========================
          const arrUsers = statex$.default.users.get();

          const userFiltrado = arrUsers.filter(function (c) {
            return c.email == email;
          });

          //console.log("cifrando 2")
          const _id = new Types.ObjectId();
          const today = new Date().toISOString()
          //Creating groupMessage
          const newMessage={
            _id  :_id.toString(),
            grupo  :groupId, //grupo al q pertenece el mensaje
            user  :userFiltrado[0], 
            message  : "", 
            tipo  :"IMAGE", 
            tipo_cifrado  :"", 
            message_replied:null,
            email_replied:null,
            tipo_cifrado_replied:null,
            forwarded:"false",
            createdat  :today, 
            updatedat  :today,
            image64  :"",//de inicio no se manda, se persiste hasta q llega al destino
            grupoDestino :null,
            file_name: file.name, //with extension
            file_type: file.type  //content type
            };
          //=============================================================


        
    
          const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_IMAGE_LOCAL}`;
          
          const params = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body:JSON.stringify({
              group_id:groupId,
              image64:image64,
              message_obj:JSON.stringify(newMessage)
            }),
          };
    
    
          console.log("params::::::::::::::::::::::::::")
          //console.log(params)
    
            try {
              const response = await fetch(url, params)
              //console.log(response);
              const result = await response.json();
              //console.log(result);
    
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
    async sendFileLocal(accessToken, groupId, file,email,file64) {

      EventRegister.emit("loadingEvent",true);
        try {

          //============preparing image package=========================
          const arrUsers = statex$.default.users.get();

          const userFiltrado = arrUsers.filter(function (c) {
            return c.email == email;
          });

          //console.log("cifrando 2")
          const _id = new Types.ObjectId();
          const today = new Date().toISOString();

          //Creating groupMessage
          const newMessage={
            _id  :_id.toString(),
            grupo  :groupId, //grupo al q pertenece el mensaje
            user  :userFiltrado[0], 
            message  : "", 
            tipo  :"FILE", 
            tipo_cifrado  :"", 
            message_replied:null,
            email_replied:null,
            tipo_cifrado_replied:null,
            forwarded:"false",
            createdat  :today, 
            updatedat  :today,
            image64  :"",//de inicio no se manda, se persiste hasta q llega al destino
            grupoDestino :null,
            file_name: file.name, //with extension
            file_type: file.type  //content type
            };
          //=============================================================


        
    
          const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_FILE_LOCAL}`;
          
          const params = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body:JSON.stringify({
              group_id:groupId,
              file64:file64,
              message_obj:JSON.stringify(newMessage)
            }),
          };
    
    
          console.log("params::::::::::::::::::::::::::")
          //console.log(params)
    
            try {
              const response = await fetch(url, params)
              //console.log(response);
              const result = await response.json();
              //console.log(result);
    
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

    async guardaMessage(msg) {
        try {
            let response=null;
            const today = new Date().toISOString()
            
            const file_name = msg.file_name == null ? "" : msg.file_name;
            const file_type =msg.file_type== null ? "" : msg.file_type;
          //id_message_replied
          console.log("guarda mensaje")
          console.log(msg)
            await addMessage(msg._id, msg.grupo, msg.user._id, msg.message,msg.tipo,msg.tipo_cifrado,msg.forwarded, today,file_name,file_type,msg.id_message_replied, msg.message_replied,msg.email_replied, msg.tipo_cifrado_replied  ).then(result =>{

          
          
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