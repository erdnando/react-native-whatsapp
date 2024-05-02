import * as SQLite from "expo-sqlite";
import { useState } from "react";

/*
export function useDBGroups() {

  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState([]);

 
  const fetcGroups = (tx) => {
    tx.executeSql("SELECT * FROM groups;", [], (_, { rows: { _array } }) =>
    setGroups(_array)
    );
  };

  const getGroups = (db) => {
    db.readTransaction(fetcGroups);
  };

  const getGroupByName = (db,name) => {
    tx.executeSql("SELECT * FROM groups WHERE name=?;", [name], (_, { rows: { _array } }) =>
                   setGroup(_array)
                 );
  };




  const addGroup = (db, id, name, image, creator, participants, createdAt, updatedAt) => {
    db.transaction((tx) => {
      tx.executeSql("INSERT INTO groups (id, name, participants, creator, image, image64, createdAt, updatedAt ) VALUES (?,?,?,?,?,?,?,?);", [id, name, image, creator, participants, createdAt, updatedAt]);

      fetcGroups(tx);
    });
  };



   

  const updateGroup = (db, name, image, participants,updatedAt, image64, id) => {
    db.transaction((tx) => {
      tx.executeSql("UPDATE groups SET  name = ?, image = ?, participants = ?,updatedAt=?, image64=? WHERE id = ?;", [name, image, participants,updatedAt, image64, id]);

      fetcGroups(tx);
    });
  };

  const deleteUser = (db, id) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM groups WHERE id = ?;", [id]);

      fetchUsers(tx);
    });
  };

  return {
    groups,  //<--entity obj
    group,  //<--entity obj
    getGroups,
    getGroupByName,
    addGroup,
    updateGroup,
    deleteUser
  };
}

*/