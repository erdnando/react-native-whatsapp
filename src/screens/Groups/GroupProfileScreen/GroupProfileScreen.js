import { useState, useEffect } from "react";
import { ScrollView, View,Alert } from "react-native";
import { Button } from "native-base";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Group } from "../../../api";
import { useAuth } from "../../../hooks";
import { GroupProfile } from "../../../components/Group";
import { styles } from "./GroupProfileScreen.styles";
import * as statex$ from '../../../state/local'

const groupController = new Group();

export function GroupProfileScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { accessToken } = useAuth();
  const [group, setGroup] = useState(null);
  const [reload, setReload] = useState(false);

  const onReload = () => setReload((prevState) => !prevState);

  useEffect(() => {
    (async () => {
      try {
        const response = await groupController.obtain(accessToken, params.groupId );
        console.log("===========miembros obtenidos=================");
        console.log(response);
        console.log("============================");

        setGroup(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [params.groupId, reload]);

  const exitGroup = async () => {

    if(statex$.default.flags.offline.get()=='true'){
      Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
          [{  text: 'Ok',
              onPress: async ()=>{
                console.log('modo offline!');
                statex$.default.flags.offline.set('true');
              }
        } ]);
    }else{
        try {
          await groupController.exit(accessToken, params.groupId);
          navigation.goBack();
          navigation.goBack();
        } catch (error) {
          console.error(error);
        }
    }

    
  };

  if (!group) return null;

  console.log("===========miembros obtenidos 2=================");
        console.log(group);
        console.log("============================");

  return (
    <ScrollView style={styles.content}>
      <GroupProfile.Info group={group} setGroup={setGroup} />
      <GroupProfile.Participants group={group} onReload={onReload} />

      <View style={styles.actionsContent}>
        <Button colorScheme="secondary" onPress={exitGroup}>
          Salir del grupo
        </Button>
      </View>
    </ScrollView>
  );
}