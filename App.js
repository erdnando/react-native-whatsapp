import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { HandlerNavigation } from "./src/navigations";
import { AuthProvider } from "./src/contexts";
import "intl";
import "intl/locale-data/jsonp/es";
import { DBProvider } from "./src/contexts/DBContext";



;

export default function App() {
/*
  const [db, setDb] = useState(SQLite.openDatabase('chatx.db'));
const createTable=(table) => {
  console.log('creating table....');

  db.transaction( tx =>{
    tx.executeSql('CREATE TABLE IF NOT EXISTS '+ table +' (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT) ');
  });

}

createTable('USERS');*/

  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <AuthProvider>
            <HandlerNavigation />
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  );

 
}
