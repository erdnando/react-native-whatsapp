import * as SQLite from 'expo-sqlite';

//Connection is initialised globally
const db = SQLite.openDatabase("chatappx.db",'v1');


export default db;