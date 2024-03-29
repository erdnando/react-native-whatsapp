import { ENV,Encrypt,Decrypt } from "../utils";
import { useDB } from "../hooks";
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
      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE}/${groupId}`;
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


//==============================================================================================
  async sendText(accessToken, groupId, message,tipoCifrado) {
   
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
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      //get group messages and persist
     // await selectTable('BITACORA');

      if (response.status !== 201) throw result;

      return true;
    } catch (error) {
      throw error;
    }
  }
//=====================================================================================================
  async sendImage(accessToken, groupId, file) {
    try {
      const formData = new FormData();
      formData.append("group_id", groupId);
      formData.append("image", file);

      const url = `${ENV.API_URL}/${ENV.ENDPOINTS.GROUP_MESSAGE_IMAGE}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;

      return true;
    } catch (error) {
      throw error;
    }
  }
  //=====================================================================================================



}
