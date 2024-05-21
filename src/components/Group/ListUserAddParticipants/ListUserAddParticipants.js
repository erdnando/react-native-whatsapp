import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Avatar, IconButton, CheckIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { map, size } from "lodash";
import { ENV } from "../../../utils";
import { styles } from "./ListUserAddParticipants.styles";

export function ListUserAddParticipants(props) {
  
  const { users, addParticipants } = props;
  const [ids, setIds] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
  
   // console.log(users)
    navigation.setOptions({
      headerRight: () => {
        if (size(ids) > 0) {
          return (
            <IconButton
              icon={<CheckIcon size="lg" />}
              padding={0}
              onPress={onAddParticipants}
            />
          );
        }
        return null;
      },
    });
  }, [ids]);

  const selectedUnselectdUser = (user) => {
//validate if this group is close or open
    setIds(user._id)
    /*const isFound = ids.includes(user._id);

    if (isFound) {
      const newArray = ids.filter((userId) => userId !== user._id);
      setIds(newArray);
    } else {
      setIds((prevState) => [...prevState, user._id]);
    }*/
  };

  const isSelectedUser = (userId) => {
    return ids.includes(userId);
  };

  const onAddParticipants = () => {
    addParticipants(ids);
  };

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {map(users, (user) => (
        
        <TouchableOpacity
          key={user._id}
          onPress={() => selectedUnselectdUser(user)}
          style={[styles.item, isSelectedUser(user._id) && styles.selected]}
        >
          <Avatar
            bg="cyan.500"
            marginRight={3}
            source={{ uri: `${ENV.BASE_PATH}/group/group1.png`}}
          >
            {user.email.substring(0, 2).toUpperCase()}
          </Avatar>

          <View style={styles.info}>
            <Text style={styles.name}>
              {user.firstname || user.lastname
                ? `${user.firstname || ""} ${user.lastname || ""}`
                : "..."}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}