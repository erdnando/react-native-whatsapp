import * as SQLite from "expo-sqlite";
import { useState } from "react";

/*
export function useDBUsers() {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);

 
  const fetchUsers = (tx) => {
    tx.executeSql("SELECT * FROM users;", [], (_, { rows: { _array } }) =>
    setUsers(_array)
    );
  };

  const getUsers = (db) => {
    db.readTransaction(fetchUsers);
  };

  const getUsersById = (db, email) => {
    tx.executeSql("SELECT * FROM users WHERE email=?;", [email], (_, { rows: { _array } }) =>
                   setUser(_array)
                 );
  };

  const addUser = (db, id, email, firstname, lastname, password, avatar, nip, token, createdAt, updatedAt,avatar64) => {
    db.transaction((tx) => {
      tx.executeSql("INSERT INTO users (id, email, firstname, lastname, password, avatar, nip, token, createdAt, updatedAt,avatar64) VALUES (?,?,?,?,?,?,?,?,?,?,?);", [id, email, firstname, lastname, password, avatar, nip, token, createdAt, updatedAt, avatar64]);

      fetchUsers(tx);
    });
  };



  const updateUser = (db, firstname, lastname, password, avatar, nip, updatedAt, avatar64, email) => {
    db.transaction((tx) => {
      tx.executeSql("UPDATE users SET  firstname=?, lastname=?, password=?, avatar=?, nip=?, updatedAt=?, avatar64=? WHERE email = ?;", [id, email, firstname, lastname, password, avatar, nip, token, createdAt, updatedAt,avatar64, email]);

      fetchUsers(tx);
    });
  };

  const deleteUser = (db, email) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM users WHERE email = ?;", [email]);

      fetchUsers(tx);
    });
  };

  return {
    users,  //<--entity obj
    user,  //<--entity obj
    getUsers,
    getUsersById,
    addUser,
    updateUser,
    deleteUser
  };
}

*/