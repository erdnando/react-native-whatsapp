import * as SQLite from "expo-sqlite";
//import { BaseModel, types } from "expo-sqlite-orm"

/*
export default class GrupoMessages extends BaseModel {
  
  
  constructor(obj) { super(obj); }

  static get database() {
    return async () => SQLite.openDatabase("chatx.db");
  }

  static get tableName() {
    return "tbl_groupmessages";
  }

  static get columnMapping() {
    return {
      id: { type: types.TEXT, primary_key: true }, // For while only supports id as primary key
      group: { type: types.TEXT },
      user: { type: types.TEXT },
      message: { type: types.TEXT },
      tipo_cifrado: { type: types.TEXT },
      email_replied: { type: types.TEXT },
      message_replied: { type: types.TEXT },
      tipo_cifrado_replied: { type: types.TEXT },
      forwarded: { type: types.TEXT },
      createdAt:{ type: types.TEXT },
      updatedAt: { type: types.TEXT },
    };
  }

  static getGrupoMessages() {
     const sql ="SELECT * FROM tbl_groupmessages";
      return this.repository.databaseLayer
        .executeSql(sql)
        .then(({ rows }) => rows)
        .catch(error => JSON.stringify(error));
  }

  static getUserById( name ) {
    const sql = 'select * from tbl_groups where name = ?  ORDER BY 1 DESC'
    const params = [name]
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows)
  }

  static updateUserNipById( message, tipo_cifrado, id ) {
    const sql = 'update tbl_groups set message = ?, tipo_cifrado=? where id=? '
    const params = [message, tipo_cifrado, id ]
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows)
  }




}

*/