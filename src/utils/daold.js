import * as SQLite from "expo-sqlite";
import { useState } from "react";
//import db from '../sqlite/sqlite'

/*

const [groups, setGroups] = useState([]);
const [group, setGroup] = useState([]);

const [users, setUsers] = useState([]);
const [user, setUser] = useState([]);


const fetchUsers = (tx) => {
  tx.executeSql("SELECT * FROM users;", [], (_, { rows: { _array } }) =>
  setUsers(_array)
  );
};

const getUsers = () => {
  db.readTransaction(fetchUsers);
};

const getUsersById = (email) => {
  db.transaction((tx) => {
            tx.executeSql("SELECT * FROM users WHERE email=?;", [email], (_, { rows: { _array } }) =>
                          setUser(_array)
                        );
           })
};

const addUser = (id, email, firstname, lastname, password, avatar, nip, token, createdAt, updatedAt,avatar64) => {
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
//=================================================================================================================================================================

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

const deleteGroup = (db, id) => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM groups WHERE id = ?;", [id]);

    fetchUsers(tx);
  });
};



export const userEntity = {
  getUsers,
  getUsersById,
  addUser,
  updateUser,
  deleteUser,

  getGroups,
  getGroupByName,
  addGroup,
  updateGroup,
  deleteGroup
};

*/