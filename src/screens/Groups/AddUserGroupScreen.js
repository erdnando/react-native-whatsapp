import { useState, useEffect } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { User, Group } from "../../api";
import { useAuth } from "../../hooks";
import { Search, ListUserAddParticipants } from "../../components/Group";
import { EventRegister } from "react-native-event-listeners";
import * as statex$ from '../../state/local'

const userController = new User();
const groupController = new Group();

export function AddUserGroupScreen() {

  const [users, setUsers] = useState(null);
  const [usersSearch, setUserSearch] = useState(null);
  const [usersResult, setUsersResult] = useState(null);
  const { accessToken } = useAuth();
  const { params } = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
       // console.log("getting users, except member of this group")
       // console.log("grupo:")
       // console.log(params)
       // console.log(params.groupId)
        const response = await userController.getUsersExeptParticipantsGroup(
          accessToken,
          params.groupId
        );
        setUsers(response);
        setUsersResult([]);//response
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const addParticipants = async (ids) => {
    try {
      const d = new Date();
      let ms = d.getMilliseconds();
      statex$.default.lastGroupInvitation.set(ms);//clean flag

      await groupController.addParticipants(accessToken, params.groupId, ids);
      
     
      navigation.goBack();
      navigation.goBack();
      EventRegister.emit("participantsModified",true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Search data={users} setData={setUsersResult} />
      <ListUserAddParticipants
        users={usersResult}
        addParticipants={addParticipants}
      />
    </View>
  );
}