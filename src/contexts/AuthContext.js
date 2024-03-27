import { useState, useEffect, createContext } from "react";
import { User, Auth, Group } from "../api";
import { hasExpiredToken } from "../utils";
import Constants from 'expo-constants';
//import * as SQLite from 'expo-sqlite';


const userController = new User();
const authController = new Auth();
const groupController = new Group();


export const AuthContext = createContext();

export function AuthProvider(props) {
  
  //const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
  const { children } = props;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  //Metodo incial....

  useEffect( () => {
    (async () => {

    //dropTable('USERS');
  // deleteTable('USERS');
   // createTable('USERS');
    //AddUser('erdnando@gmail.com');
    //SelectTable('USERS');

  })();  

  }, []);

  useEffect(() => {
    (async () => {
     
      //console.log("usuarios:::");
      //console.log(usuario);
     //get UUID
     const idApp = Constants.installationId;
     // await authController.removeTokens();

     const userRegistrado = await authController.login(idApp, idApp  );
     const { access, refresh } = userRegistrado;

     console.log("accessToken:" + access);

     if(access=="" || access == undefined){
      //if it's not registered, registered it
      console.log("Registrando:" + idApp);

      await authController.register(idApp, idApp);

        const responseLogin = await authController.login( idApp,idApp);

        console.log("login",responseLogin);

        const { access, refresh } = responseLogin;

        await authController.setAccessToken(access);
        await authController.setRefreshToken(refresh);
        setUser(idApp);

        //Creating its own personal group
        //-------------------------------------------------------------
        
        await groupController.createAuto(
          access,
          idApp,
          idApp,
          idApp
        );
        //-------------------------------------------------------------

        await login(access);
    }else{
      console.log("Accessing directly")
      await authController.setAccessToken(access);
      await authController.setRefreshToken(refresh);
      await login(access);  
    }



      setLoading(false);
    })();
  }, []);

  const AddUser=(email) => {
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
  }

  const SelectTable=(table) => {
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

  

  const reLogin = async (refreshToken) => {
    try {
      const { accessToken } = await authController.refreshAccessToken(
        refreshToken
      );
      await authController.setAccessToken(accessToken);
      await login(accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (accessToken) => {
    try {
      setLoading(true);

      const response = await userController.getMe(accessToken);
      setUser(response);
      setToken(accessToken);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authController.removeTokens();
  };

  const updateUser = (key, value) => {
    setUser({
      ...user,
      [key]: value,
    });
  };

  const data = {
    accessToken: token,
    user,
    login,
    logout,
    updateUser,
  };

  if (loading) return null;

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
