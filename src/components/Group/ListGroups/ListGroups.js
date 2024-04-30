import { View, ScrollView, Text } from "react-native";
import {  useEffect } from "react";
import { map, size } from "lodash";
import { Item } from "./Item";
import { useAuth } from "../../../hooks";
import { styles } from "./ListGroups.styles";
import * as statex$ from '../../../state/local'
import { GroupMessage, User } from "../../../api";

const groupMessageController = new GroupMessage();
const usersController = new User();

export function ListGroups(props) {
  const { groups, upGroupChat } = props;
  const { accessToken } = useAuth();
  

  useEffect( () => {

      async function fetchData() {
      
          if(statex$.default.flags.offline.get()=='false'){

            console.log("Gathering all data into state")
            //to gather all groups with their messages into state
            statex$.default.groupmessages.set([]);//clean
            const arrMessageGrupo = statex$.default.groupmessages.get();//get last version

            //Por cada grupo
            groups.forEach( async (gpo) => { 
               console.log("gpo-------------->")
               console.log(gpo)
                const gpoMessages = await groupMessageController.getAll(accessToken, gpo._id);

                console.log("gpoMessages get all-->")
                console.log(gpoMessages)

                statex$.default.groupmessages.set((arrMessageGrupo) => [...arrMessageGrupo, gpoMessages])
            });

            console.log("Mensajes recuperados!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
            console.log(statex$.default.groupmessages.get())

            const arrUsers = await usersController.getAllUsers(accessToken);
            statex$.default.user.set(arrUsers);

            console.log("User recuperados!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
            console.log(statex$.default.user.get())
        }
    }

    console.log("=======================Gathering DATA!!!!!!!!===============================")
    fetchData();
 

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