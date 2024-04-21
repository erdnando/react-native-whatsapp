import { useState, useEffect, createContext } from "react";
import { User, Auth, Group } from "../api";
//import { hasExpiredToken } from "../utils";
//import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';


const userController = new User();
const authController = new Auth();
const groupController = new Group();


export const DBContext = createContext();

export function DBProvider(props) {
  
  const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
  const { children } = props;
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  //Metodo incial....


    //dropTable('USERS');
  // deleteTable('USERS');
   // createTable('USERS');
   // AddUser('erdnando@gmail.com');
   // SelectTable('USERS');
   useEffect( () => {
    (async () => {
     // setLoading(true);
     createTables();
      
     // setLoading(false);
  })();  

}, []);


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


  const addUser=(email) => {
    setLoading(true);
    console.log('inserting.....');

    db.transaction(tx =>{
      tx.executeSql('INSERT INTO users (_id,email,firstname,lastname,password,avatar,nip) values (?,?,?,?,?,?,?)', ['11111111111111111',email,'','',email,'',''],
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

  const selectTable=(table) => {
    setLoading(true);
    console.log('selecting.......');

    db.transaction( tx =>{
      tx.executeSql('SELECT * FROM '+table, null,
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

  const dropTables=(table) => {
    console.log('dropping tables');
    db.transaction(tx =>{ 
        tx.executeSql('DROP TABLE groupmessages');
        tx.executeSql('DROP TABLE groups');
        tx.executeSql('DROP TABLE users');
    });
  }

  const createTables=(table) => {
    console.log('creating table....');

    db.transaction( tx =>{
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (_id TEXT PRIMARY KEY,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT) ');
      tx.executeSql('CREATE TABLE IF NOT EXISTS groups (_id TEXT PRIMARY KEY,name TEXT, participants TEXT, creator TEXT, image TEXT) ');
      tx.executeSql('CREATE TABLE IF NOT EXISTS groupmessages (_id TEXT PRIMARY KEY,group TEXT, user TEXT, message TEXT, type TEXT, tipo_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT) ');
    });
  }

  


  

  const data = {
    getUsers,
    selectTable,
    addUser,
  };

  //if (loading) return null;

  return <DBContext.Provider value={data}>{children}</DBContext.Provider>;
}
