import * as SQLite from "expo-sqlite";
//import { BaseModel, types } from "expo-sqlite-orm"

/*
export default class Users extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase("chatx.db");
  }

  static get tableName() {
    return "tbl_users";
  }

  static get columnMapping() {
    return {
      id: { type: types.TEXT, primary_key: true }, // For while only supports id as primary key
      email: { type: types.TEXT },
      firstname: { type: types.TEXT },
      lastname: { type: types.TEXT },
      password: { type: types.TEXT },
      avatar: { type: types.TEXT },
      nip: { type: types.TEXT },
      token: { type: types.TEXT },
      createdAt: { type: types.TEXT },
      updatedAt: { type: types.TEXT }
    };
  }

  static login( email, password ) {
    const sql = 'select * from tbl_users where email = ? and password= ? '
    const params = [email, password]
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows)
  }


  static getUsers() {
     const sql ="SELECT * FROM tbl_users";
      return this.repository.databaseLayer
        .executeSql(sql)
        .then(({ rows }) => rows)
        .catch(error => JSON.stringify(error));
  }

  static getUserById( id ) {
    const sql = 'select * from tbl_users where id = ? '
    const params = [id]
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows)
  }

  static updateUserNipById( email, nip ) {
    const sql = 'update tbl_users set nip = ? where email=? '
    const params = [nip, email]
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows)
  }

}





*/