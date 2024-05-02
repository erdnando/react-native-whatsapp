import * as SQLite from "expo-sqlite";
import { useState } from "react";

/*
export function useDBGroupMessage() {

  const [gpoMessages, setGpoMessages] = useState([]);
  const [gpoMessage, setGpoMessage] = useState([]);

 
  const fetchGpoMessages = (tx) => {
    tx.executeSql("SELECT * FROM groupmessage;", [], (_, { rows: { _array } }) =>
    setGpoMessages(_array)
    );
  };

  const getGrupoMessages = (db) => {
    db.readTransaction(fetchGpoMessages);
  };

  const getGpoMessageById = (db,id) => {
    tx.executeSql("SELECT * FROM groupmessage WHERE id=?;", [id], (_, { rows: { _array } }) =>
                   setUser(_array)
                 );
  };

  const addGrupoMessage = (db, id, group, user, message, type, tip_cifrado, forwarded, createdAt, updatedAt) => {
    db.transaction((tx) => {
      tx.executeSql("INSERT INTO groupmessage (id, group, user, message, type, tip_cifrado, forwarded, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?);", [id, group, user, message, type, tip_cifrado, forwarded, createdAt, updatedAt]);

      fetchGpoMessages(tx);
    });
  };

  const updateGpoMessage = (db, message, type, tip_cifrado, forwarded, nip, updatedAt,id) => {
    db.transaction((tx) => {
      tx.executeSql("UPDATE groupmessage SET  message=?, type=?, tip_cifrado=?, forwarded=?, nip=?, updatedAt=? WHERE id = ?;", [message, type, tip_cifrado, forwarded, nip, updatedAt,id]);

      fetchGpoMessages(tx);
    });
  };

  const deleteGpoMessage = (db, id) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM groupmessage WHERE id = ?;", [id]);

      fetchGpoMessages(tx);
    });
  };

  return {
    getGrupoMessages,  //<--entity obj
    getGpoMessageById,
    addGrupoMessage,  //<--entity obj
    addGrupoMessage,
    updateGpoMessage,
    deleteGpoMessage
  };
}

*/