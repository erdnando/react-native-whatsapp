//import { useSQLiteContext } from 'expo-sqlite/next';
import * as SQLite from 'expo-sqlite/legacy';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('db3.db');


  export  async function loadDB(){
  const dbName= "db3.db";
  const dbAsset = require("../../assets/db3.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  
  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  if(!fileInfo.exists){
    console.log("no existe, a recrear de nuevo")
   await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`,{ intermediates: true });
   await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
}

//==================================================================================================================================================================================
export  function fnDropTableUsers() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("DROP TABLE users;" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==================================================================================================================================================================================
export  function fnDropTableGroups() {
  

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("DROP TABLE groups;" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==================================================================================================================================================================================
export  function fnDropTableGroupMessages() {
 

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("DROP TABLE messages;" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==================================================================================================================================================================================
export  function fnCreateTableUsers() {

  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS users ( _id TEXT, email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, token TEXT, createdat TEXT, updatedat TEXT, avatar64 TEXT,nipraw TEXT);" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

//==================================================================================================================================================================================
export  function fnCreateTableGroups() {
 
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS groups (_id TEXT,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT, createdat TEXT, updatedat TEXT);", 
        (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}
//==================================================================================================================================================================================

export  function fnCreateTableGroupMessages() {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS messages (_id TEXT, grupo TEXT, user TEXT, message TEXT, tipo TEXT, tipo_cifrado TEXT, forwarded TEXT, createdat TEXT, updatedat TEXT,file_name TEXT,file_type TEXT,id_message_replied TEXT,message_replied TEXT,email_replied TEXT,tipo_cifrado_replied TEXT );", 
        (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });

}

//==================================================================================================================================================================================
//======================USERS=======================================================================================================================================================
                 
export  function findUsersByEmail(email) {

  
  
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

export  function addUser(_id,email,hashPassword,nipCifrado,token,today,nipraw) {
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
         //id ,email , firstname , lastname , password , avatar , nip , token , createdat , updatedat , avatar64 
        tx.executeSql('INSERT INTO users(_id, email,firstname,lastname,password,avatar,nip,token,createdat,updatedat,avatar64,nipraw) values(?,?,?,?,?,?,?,?,?,?,?,?)', 
                                        [_id,email,'','',hashPassword,'group/group1.png',nipCifrado,token,today, today,'',nipraw], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });

        
}

//==================================================================================================================================================================================

export  function updateNip(nipraw,nipcifrado,email){
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE  users set nipraw=?, nip=? where email=?', [nipraw, nipcifrado,email], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });
}

export  function updateAlias(alias, email){
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE  users set firstname=? where email=?', [alias,email], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });
}
//====================GROUPS========================================================================================================================================================

export async function addGroup(_id, creatorId, usersId, name, today) {
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
         //id , name , participants , creator , image , image64 , createdat , updatedat 
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

//===================MESSAGES=======================================================================================================================================================
export  function addMessage(_id , group , user , message , tipo , tipo_cifrado , forwarded , today, file_name,file_type,id_message_replied ,message_replied ,email_replied ,tipo_cifrado_replied ) {
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql('INSERT INTO messages(_id , grupo , user , message , tipo , tipo_cifrado , forwarded , createdat , updatedat, file_name,file_type,id_message_replied,message_replied,email_replied,tipo_cifrado_replied ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                                        [_id,group,user,message,tipo,tipo_cifrado,forwarded,today, today,file_name,file_type,id_message_replied ,message_replied ,email_replied,tipo_cifrado_replied ], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });    
}

export  function deleteMessageById(_id ) {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql('DELETE from messages WHERE _id =?', [_id], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });    
}

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

export  function updateMessage(_id,message,tip_cifrado,fechaActualizacion){

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE  messages set message=?, tip_cifrado=?, updatedat=? where _id=?', [message,tip_cifrado, fechaActualizacion,_id], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });
}

export  function updateMessageReplied(_id,id_message_replied, message_replied,email_replied, tipo_cifrado_replied){
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE  messages set id_message_replied=?, message_replied=?,email_replied=?, tipo_cifrado_replied=? where _id=?', [id_message_replied, message_replied,email_replied, tipo_cifrado_replied, _id], 
          // Success callback 
          (_, result) => resolve(result), 
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });
}

export async function findMessageImageById(_id){
  
  return new Promise((resolve, reject) => {
    db.transaction(
          tx => {
            // Execute SQL operation
            tx.executeSql("SELECT message FROM messages where _id=?", [_id], (_, result) => resolve(result), (_, error) => reject(error) );
          }
        );
      });  
}




//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================

//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================

//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================


//=================================================================================================================================================================================




















