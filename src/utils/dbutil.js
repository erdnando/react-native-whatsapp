import { useState,useRef } from "react";
import * as SQLite from 'expo-sqlite';


const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));

const createTables=(table) => {
  console.log('creating tables....');

  db.transaction( tx =>{
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (_id TEXT PRIMARY KEY,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT) ');
    tx.executeSql('CREATE TABLE IF NOT EXISTS groups (_id TEXT PRIMARY KEY,name TEXT, participants TEXT, creator TEXT, image TEXT) ');
    tx.executeSql('CREATE TABLE IF NOT EXISTS groupmessages (_id TEXT PRIMARY KEY,group TEXT, user TEXT, message TEXT, type TEXT, tipo_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT) ');
  });
}

const getUsers = (successCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(
        'select * from users',[],
        (_, { rows: { _array } }) => {
          successCallback(_array);
        }
      );
    },
  );
}


const addUser=(_id,email , firstname , lastname , password , avatar , nip) => {
  //setLoading(true);
  console.log('inserting.....');

  db.transaction(tx =>{
    tx.executeSql('INSERT INTO users (_id,email , firstname , lastname , password , avatar , nip ) values (?,?,?,?,?,?,?)', [_id,email , firstname , lastname , password , avatar , nip],
    (txObj,resulSet) =>{
      console.log("Inserted data......");
      console.log(resulSet);

      //let existingUsers = [...usuario];
      //existingUsers.push({id: resulSet.insertId, email: [email]});
      //setUsuario(existingUsers);
    
    },
    (txtObj,error)=> console.log(error),
    )
  });

  //setLoading(false);
}



export {createTables,getUsers,addUser};


