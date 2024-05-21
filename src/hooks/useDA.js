//import { useSQLiteContext } from 'expo-sqlite/next';
import * as SQLite from 'expo-sqlite/legacy';
//import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('db05.db');


/*  export  async function loadDB(){
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
}*/

//==================================================================================================================================================================================
export  function CREATE_STATE_AUTHLOGIN() {

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql("CREATE TABLE IF NOT EXISTS STATE_AUTHLOGIN (valor TEXT);" , (_, result) => resolve(result), (_, error) => reject(error));
        }
      );
    });
  }

  export  function ADD_STATE_AUTHLOGIN(valor) {
  
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {

          tx.executeSql("DELETE from STATE_AUTHLOGIN;" , (_, result) => resolve(result), (_, error) => reject(error));
          tx.executeSql('INSERT INTO STATE_AUTHLOGIN (valor) values(?)', [valor], (_, result) => resolve(result), (_, error) => reject(error) );
        }
      );
    });    
  }


  export  function GET_STATE_AUTHLOGIN() {

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          // Execute SQL operation
          tx.executeSql("SELECT * FROM STATE_AUTHLOGIN;", [], 
            // Success callback
            (_, result) => resolve(result),
            // Error callback
            (_, error) => reject(error)
          );
        }
      );
    });     
  }
  

//====================================================================================================================================================

export  function CREATE_STATE_GETME() {

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql("CREATE TABLE IF NOT EXISTS STATE_GETME (valor TEXT);" , (_, result) => resolve(result), (_, error) => reject(error));
        }
      );
    });
  }

  export  function ADD_STATE_GETME(valor) {
  
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {

          tx.executeSql("DELETE from STATE_GETME;" , (_, result) => resolve(result), (_, error) => reject(error));
          tx.executeSql('INSERT INTO STATE_GETME (valor) values(?)', [valor], (_, result) => resolve(result), (_, error) => reject(error) );
        }
      );
    });    
  }


  export  function GET_STATE_GETME() {

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          // Execute SQL operation
          tx.executeSql("SELECT * FROM STATE_GETME;", [], 
            // Success callback
            (_, result) => resolve(result),
            // Error callback
            (_, error) => reject(error)
          );
        }
      );
    });     
  }

  //================================================================================================================================================

  export  function CREATE_STATE_ALLGROUPS() {

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql("CREATE TABLE IF NOT EXISTS STATE_ALLGROUPS (valor TEXT);" , (_, result) => resolve(result), (_, error) => reject(error));
        }
      );
    });
  }

  export  function ADD_STATE_ALLGROUPS(valor) {
  
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql('INSERT INTO STATE_ALLGROUPS (valor) values(?)', [valor], (_, result) => resolve(result), (_, error) => reject(error) );
        }
      );
    });    
  }
  export  function UPDATE_STATE_ALLGROUPS(valor) {

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql('UPDATE STATE_ALLGROUPS set valor=?', [valor],  (_, result) => resolve(result), (_, error) => reject(error) );
        }
      );
    });    
  }


  export  function GET_STATE_ALLGROUPS() {

    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          // Execute SQL operation
          tx.executeSql("SELECT * FROM STATE_ALLGROUPS;", [], 
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

export  function CREATE_STATE_ALLMESSAGES() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS STATE_ALLMESSAGES (valor TEXT, groupId TEXT, llave TEXT, tipo TEXT);" , (_, result) => resolve(result), (_, error) => reject(error));
      }
    );
  });
}

export  function UPDATE_STATE_ALLMESSAGES(valor, groupId) {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE STATE_ALLMESSAGES set valor=? where groupId=?', [valor,groupId],  (_, result) => resolve(result), (_, error) => reject(error) );
      }
    );
  });    
}

export  function UPDATE_STATE_ALLMESSAGES_LLAVE(llave, groupId) {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE STATE_ALLMESSAGES set llave=? where groupId=?', [llave,groupId],  (_, result) => resolve(result), (_, error) => reject(error) );
      }
    );
  });    
}

export  function ADD_STATE_ALLMESSAGES(valor,groupId,llave, tipo) {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO STATE_ALLMESSAGES (valor,groupId,llave,tipo) values(?,?,?,?)', [valor,groupId,llave,tipo], (_, result) => resolve(result), (_, error) => reject(error) );
      }
    );
  });    
}


export  function GET_STATE_ALLMESSAGESBYID(groupId) {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("SELECT valor, llave, groupId,tipo  FROM STATE_ALLMESSAGES WHERE groupId=?;", [groupId], (_, result) => resolve(result),(_, error) => reject(error) );
      }
    );
  });     
}

export  function GET_STATE_ALLMESSAGES() {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql("SELECT valor, llave, groupId, tipo  FROM STATE_ALLMESSAGES;", [], (_, result) => resolve(result),(_, error) => reject(error) );
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

export  function updateGroupName(groupId, newName){
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE  groups set name=? where _id=?', [newName,groupId], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );
      }
    );
  });
}


export  function updateGroupParticipants(groupId, arrParticipants){
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE  groups set participants=? where _id=?', [arrParticipants,groupId], 
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
export  function addMessage(_id , grupo , user , message , tipo , tipo_cifrado , forwarded , today, file_name,file_type,id_message_replied ,message_replied ,email_replied ,tipo_cifrado_replied ) {
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql('INSERT INTO messages(_id , grupo , user , message , tipo , tipo_cifrado , forwarded , createdat , updatedat, file_name,file_type,id_message_replied,message_replied,email_replied,tipo_cifrado_replied ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                                        [_id,grupo,user,message,tipo,tipo_cifrado,forwarded,today, today,file_name,file_type,id_message_replied ,message_replied ,email_replied,tipo_cifrado_replied ], 
          // Success callback
          (_, result) => resolve(result),
          // Error callback
          (_, error) => reject(error)
        );

      }
    );
  });    
}

export  function addMessage64(id_message , file64 ) {
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql('INSERT INTO messages64(id_message ,file64  ) values(?,?)', [id_message,file64 ], (_, result) => resolve(result), (_, error) => reject(error) );
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

export  function findAll64Messages() {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql("SELECT * FROM messages64", [], (_, result) => resolve(result), (_, error) => reject(error) );
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


export async function getFile64ById(id_message){
  
  return new Promise((resolve, reject) => {
    db.transaction(
          tx => {
            // Execute SQL operation
            tx.executeSql("SELECT file64 FROM messages64 where id_message=?", [id_message], (_, result) => resolve(result), (_, error) => reject(error) );
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




















