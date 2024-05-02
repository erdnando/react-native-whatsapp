import * as SQLite from "expo-sqlite";

//Connection is initialised globally
const db = SQLite.openDatabase("chatx.db");

/*
export function db() {
  db.transaction((tx) => {
    tx.executeSql("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, token TEXT, createdAt TEXT, updatedAt TEXT, avatar64 TEXT);" );
    tx.executeSql("CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT, createdAt TEXT, updatedAt TEXT);" );
    tx.executeSql("CREATE TABLE IF NOT EXISTS groupmessage (id TEXT PRIMARY KEY, group TEXT, user TEXT, message TEXT, type TEXT, tip_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT);" );
  });
}*/

export default db;