import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { HandlerNavigation } from "./src/navigations";
import { AuthProvider } from "./src/contexts";
import NetInfo from '@react-native-community/netinfo';
import * as statex$ from './src/state/local'

export default function App() {

 
  const unsubscribe = NetInfo.addEventListener(state => {
    //console.log('Is connected?', state.isConnected);
    statex$.default.isConnected.set(state.isConnected)
    
  });

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
