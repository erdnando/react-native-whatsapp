import * as SQLite from 'expo-sqlite';

//Connection is initialised globally
const db = SQLite.openDatabase("db.db");


export default db;