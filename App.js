import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { HandlerNavigation } from "./src/navigations";
import { AuthProvider } from "./src/contexts";
import "intl";
import "intl/locale-data/jsonp/es";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const loadDatabase = async () =>{
  const dbName= "securechat.db";
  const dbAsset = require("./assets/securechat.db");
}

export default function App() {

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
