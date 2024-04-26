import { SafeAreaView } from "react-native";
import { useAuth } from "../../hooks";
import { UserInfo, Options } from "../../components/Settings";

export function SettingsScreen() {
  const { user, accessToken, logout, updateUser } = useAuth();

  console.log(user)
  console.log("user")
  return (
    <SafeAreaView>
      <UserInfo user={user} />
      <Options
        accessToken={accessToken}
        logout={logout}
        updateUser={updateUser}
      />
    </SafeAreaView>
  );
}
