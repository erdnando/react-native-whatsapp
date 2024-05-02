import db from '../sqlite/sqlite'



//==============================================================================================================================================================================================================================
export function fnCreateTables() {

  console.log('creando tablas.......');

  db.transaction( tx =>{
    tx.executeSql("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, token TEXT, createdAt TEXT, updatedAt TEXT, avatar64 TEXT);" );
    tx.executeSql("CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT, createdAt TEXT, updatedAt TEXT);" );
    tx.executeSql("CREATE TABLE IF NOT EXISTS groupmessage (id TEXT PRIMARY KEY, group TEXT, user TEXT, message TEXT, type TEXT, tip_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT);" );
  });
}

//==============================================================================================================================================================================================================================

export  function findUsersByEmail(email) {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql('SELECT * FROM users where email=?', [email], 
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

export  function addUser(_id,email,hashPassword,nipCifrado,token) {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
         //id ,email , firstname , lastname , password , avatar , nip , token , createdAt , updatedAt , avatar64 
        tx.executeSql('INSERT INTO USERS (id, email,firstname,lastname,password,avatar, nip , token , createdAt , updatedAt , avatar64 ) values (?,?,?,?,?,?,?,?,?,?,?)', [_id,email,'','',hashPassword,'',nipCifrado,token,new Date(), new Date()], 
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

export  function addGroup(_id, creatorId, usersId, name) {
 
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Execute SQL operation
         //id , name , participants , creator , image , image64 , createdAt , updatedAt 
        tx.executeSql('INSERT INTO USERS (id , name , participants , creator , image , image64 , createdAt , updatedAt ) values (?,?,?,?,?,?,?,?)', [_id, name, usersId, creatorId ,'','',new Date(), new Date()], 
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

export  function deleteUserTables() {
 
    db.transaction(
      tx => {
        // Execute SQL operation
        tx.executeSql('DELETE FROM users');
        tx.executeSql('DELETE FROM groups');
        tx.executeSql('DELETE FROM groupmessage');
      }
    );
}
//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================


//==============================================================================================================================================================================================================================