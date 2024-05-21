import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabNavigation } from "./BottomTabNavigation";
import { useNavigation } from "@react-navigation/native";
import {
  UserProfileScreen,
  CameraScreen,
  ImageFullScreen,RecordCameraScreen
} from "../screens/Global";
import { ChatScreen } from "../screens/Chats";
import {
  GroupScreen,
  GroupProfileScreen,
  AddUserGroupScreen,
  ChangeNameGroupScreen,
} from "../screens/Groups";
import { screens, initSockets } from "../utils";
import { styles } from "./Styles.styles";
import { Button } from "react-native";
import { AddIcon, IconButton, ChevronLeftIcon } from "native-base";

initSockets();

const Stack = createNativeStackNavigator();




export function AppNavigation() {

  const navigation = useNavigation();
  const regresar = async () => {
    navigation.goBack();
   
  };

  return (
    <Stack.Navigator>

      <Stack.Screen
        name={screens.tab.root}
        component={BottomTabNavigation}
        options={{ headerShown: false }}
      />

      {/*<Stack.Screen
        name={screens.global.chatScreen}
        component={ChatScreen}
        options={{ headerShown: false, ...styles.stackNavigationStyles }}
      />*/}
      <Stack.Screen
        name={screens.global.groupScreen}
        component={GroupScreen}
        options={{ headerShown: false, ...styles.stackNavigationStyles }}
      />


      <Stack.Group
        screenOptions={{ presentation: "modal", ...styles.modalStyles }}
      >
        <Stack.Screen
          name={screens.global.userProfileScreen}
          component={UserProfileScreen}
          options={{ title: "Info. del usuario" }}
        />
        <Stack.Screen
          name={screens.global.groupProfileScreen}
          component={GroupProfileScreen}
          options={{ headerShown: true,
            headerLeft: () => (
              <IconButton icon={<ChevronLeftIcon />} padding={0} marginRight={5} onPress={regresar} />
            ),
            title: "Info. del grupo", }}
        />
        <Stack.Screen
          name={screens.global.addUserGroupScreen}
          component={AddUserGroupScreen}
          options={{ title: "Añadir participante" }}
        />
        <Stack.Screen
          name={screens.global.changeNameGroupScreen}
          component={ChangeNameGroupScreen}
          options={{ title: "Cambiar datos del grupo" }}
        />
        <Stack.Screen
          name={screens.global.cameraScreen}
          component={CameraScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={screens.global.imageFullScreen}
          component={ImageFullScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={screens.global.recordCameraScreen}
          component={RecordCameraScreen}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}