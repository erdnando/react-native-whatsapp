//import { openDatabase } from '../sqlite/sqlite'


import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('chatappx');


//==============================================================================================================================================================================================================================
export function fnDropTableUsers() {

  //console.log('dropping tablas..users.....');

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("DROP TABLE users;" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==============================================================================================================================================================================================================================
export function fnDropTableGroups() {

  //console.log('dropping tablas..groups.....');

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("DROP TABLE groups;" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==============================================================================================================================================================================================================================
export function fnDropTableGroupMessages() {

  //console.log('dropping tablas..groupmessage.....');

  return new Promise((resolve, reject) => {
    this.db.transaction(
      tx => {
        tx.executeSql("DROP TABLE messages;" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==============================================================================================================================================================================================================================
export function fnCreateTableUsers() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS users ( _id TEXT, email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, token TEXT, createdat TEXT, updatedat TEXT, avatar64 TEXT);" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==============================================================================================================================================================================================================================
export function fnCreateTableGroups() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS groups (_id TEXT,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT, createdat TEXT, updatedat TEXT);", 
        (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}
//==============================================================================================================================================================================================================================

export function fnCreateTableGroupMessages() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS messages (_id TEXT, grupo TEXT, user TEXT, message TEXT, tipo TEXT, tip_cifrado TEXT, forwarded TEXT, createdat TEXT, updatedat TEXT);", 
        (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });

}






//==============================================================================================================================================================================================================================
                 
export  function findUsersByEmail(email) {

  //console.log("SELECT * FROM users where email=\""+email+"\"")
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql("SELECT * FROM users where email=\""+email+"\"", [], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });     
}

export  function findAllUsers() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql("SELECT * FROM users", [], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });     
}

//==============================================================================================================================================================================================================================

export  function addUser(_id,email,hashPassword,nipCifrado,token,today) {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
         //id ,email , firstname , lastname , password , avatar , nip , token , createdAt , updatedAt , avatar64 
        tx.executeSql('INSERT INTO users(_id, email,firstname,lastname,password,avatar,nip,token,createdat,updatedat,avatar64) values(?,?,?,?,?,?,?,?,?,?,?)', 
                                        [_id,email,'','',hashPassword,'',nipCifrado,token,today, today,''], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });

        
}
//==============================================================================================================================================================================================================================

export  function addGroup(_id, creatorId, usersId, name, today) {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
         //id , name , participants , creator , image , image64 , createdAt , updatedAt 
        tx.executeSql('INSERT INTO groups (_id , name , participants , creator , image , image64 , createdat , updatedat ) values (?,?,?,?,?,?,?,?)', 
        [_id, name, usersId, creatorId ,'group/group1.png','',today, today], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });
   
}

export  function addMessage(_id,email,hashPassword,nipCifrado,token,today) {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
         //_id , group , user , message , tipo , tip_cifrado , forwarded , createdat , updatedat
        tx.executeSql('INSERT INTO messages(_id , group , user , message , tipo , tip_cifrado , forwarded , createdat , updatedat) values(?,?,?,?,?,?,?,?,?)', 
                                        [0,'gpo1','yo','mensaje','TEXT','AES','false',today, today], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });

        
}
//==============================================================================================================================================================================================================================
export  function findAllGroups() {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql('SELECT * FROM groups', [], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });     
}

//==============================================================================================================================================================================================================================

export  function findAllGrupoMessages() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql("SELECT * FROM messages", [], (_, result) => resolve(result), (_, error) => reject(error) );
      }
    );
  });     
}
//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================