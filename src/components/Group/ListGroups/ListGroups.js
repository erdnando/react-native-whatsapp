import { View, ScrollView, Text } from "react-native";
import {  useEffect } from "react";
import { map, size } from "lodash";
import { Item } from "./Item";
import { useAuth } from "../../../hooks";
import { styles } from "./ListGroups.styles";

import { GroupMessage, User } from "../../../api";

const groupMessageController = new GroupMessage();
const usersController = new User();

export function ListGroups(props) {
  const { groups, upGroupChat } = props;
  const { accessToken } = useAuth();
  

  useEffect( () => {

    

}, []);


  return (
    <ScrollView alwaysBounceVertical={false}>
      <View style={styles.content}>
        {size(groups) === 0 ? (
          <Text style={styles.noGroups}>
            No tienes ningun grupo, dale al (+) para crear el primero
          </Text>
        ) : (
          map(groups, (group) => (
            <Item key={group._id} group={group} upGroupChat={upGroupChat} />
          ))
        )}
      </View>
    </ScrollView>
  );
}