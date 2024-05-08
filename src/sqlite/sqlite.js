//import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite/legacy';
import { Asset } from 'expo-asset';

async function openDatabase(pathToDatabaseFile){
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  const asset = await Asset.fromModule(require(pathToDatabaseFile)).downloadAsync();
  await FileSystem.copyAsync({
    from: asset.localUri,
    to: FileSystem.documentDirectory + 'SQLite/db.db',
  });
  return SQLite.openDatabase('db.db');
}


//Connection is initialised globally
//const db = SQLite.openDatabase("db.db");
//Open a database, creating it if it doesn't exist, and return a Database object. 
//On disk, the database will be created under the app's documents directory, 
//i.e. ${FileSystem.documentDirectory}/SQLite/${name}.

const db = openDatabase("db");


export default db;