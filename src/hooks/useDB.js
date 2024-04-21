import { useState } from "react";
import * as SQLite from 'expo-sqlite';



export function useDB() {
  
  const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
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

    setLoading(false);
  }


  //===========================================================================================================================
  const createTableBitacora=() => {
    console.log('creating table....');

    db.transaction( tx =>{
      tx.executeSql('CREATE TABLE IF NOT EXISTS BITACORA (id INTEGER PRIMARY KEY AUTOINCREMENT,group TEXT, userid TEXT, userEmail TEXT, mensaje TEXT, tipo TEXT, idServer TEXT, createdAt TEXT) ');
    });
    

  }

//===========================================================================================================================
  const addBitacora=(email) => {
    setLoading(true);
    console.log('inserting.....');

    db.transaction(tx =>{
      tx.executeSql('INSERT INTO BITACORA (group,userid,userEmail,mensaje,tipo,idServer,createdAt) values (?,?,?,?,?,?,?)', [email,'','',email,''],
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

    setLoading(false);
  }
//===========================================================================================================================

  const selectTableBitacora=() => {
    setLoading(true);
    console.log('selecting.......');

    db.transaction( tx =>{
      tx.executeSql('SELECT * FROM BITACORA', null,
      (txObj,resulSet) =>{
        console.log("resulSet:::");
        console.log(resulSet.rows._array);

        //setUsuario(resulSet.rows._array);

        
      },
      (txObj, error) => console.log(error)
      );

    });

    setLoading(false);
  }
//===========================================================================================================================

  const deleteUser=(id) => {
    db.transaction(tx =>{
      tx.executeSql('DELETE FROM USERS WHERE id=?',[id],
      (txObj,resulSet) =>{
      if(resulSet.rowsAffected>0){
        let existingUsers = [...usuario].filter(name => name.id !== id);
        setUsuario(existingUsers);
      }
      },
      (txtObj,error)=> console.log(error),
      )
    })
  }
//===========================================================================================================================

  const deleteTable=(table) => {
    console.log('deleting table '+ table);

    db.transaction(tx =>{
      tx.executeSql('DELETE FROM '+table,null,
      (txObj,resulSet) =>{
      console.log("deleted table.")
      },
      (txtObj,error)=> console.log(error),
      )
    })
  }
//===========================================================================================================================

  const dropTable=(table) => {
    console.log('dropping table '+ table);
    db.transaction(tx =>{
      tx.executeSql('DROP TABLE '+ table,null,
      (txObj,resulSet) =>{
     console.log('dropping table:' + table);
      },
      (txtObj,error)=> console.log(error),
      )
    })
  }
//===========================================================================================================================


  return {
    createTables,
    getUsers,
    addUser,
   
    
  };
}

