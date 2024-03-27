/*import { useContext } from "react";
import { DBContext } from "../contexts";

export const useDB = () => useContext(DBContext);*/

import { useState, useEffect, createContext } from "react";
import { User, Auth, Group } from "../api";
import * as SQLite from 'expo-sqlite';



export function useDB() {
  
  const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const addUser=(email) => {
    setLoading(true);
    console.log('inserting.....');

    db.transaction(tx =>{
      tx.executeSql('INSERT INTO USERS (email,firstname,lastname,password,avatar) values (?,?,?,?,?)', [email,'','',email,''],
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

  const createTable=(table) => {
    console.log('creating table....');

    db.transaction( tx =>{
      tx.executeSql('CREATE TABLE IF NOT EXISTS '+ table +' (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT) ');
    });
    

  }

  return {
    createTable,
    selectTable,
    addUser,
    deleteTable
  };
}

