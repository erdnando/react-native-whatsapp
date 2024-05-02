import * as SQLite from "expo-sqlite";


/*
export default class Groups  {


 

  static get database() {
    return async () => SQLite.openDatabase("chatx.db");
  }

  static get tableName() {
    return "tbl_groups";
  }

  creaTabla = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, count INT)'
      )
    })
  }

  static getGroups() {
     const sql ="SELECT * FROM tbl_groups";
      return this.repository.databaseLayer
        .executeSql(sql)
        .then(({ rows }) => rows)
        .catch(error => JSON.stringify(error));
  }

  static getGroupById( name ) {
    const sql = 'select * from tbl_groups where name = ?  ORDER BY 1 DESC'
    const params = [name]
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows)
  }

  static updateGrupoById( name, id ) {
    const sql = 'update tbl_groups set name = ? where id=? '
    const params = [name, id]
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows)
  }

}



*/



