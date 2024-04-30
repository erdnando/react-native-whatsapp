import { View, Text, Pressable,Alert } from "react-native";
import { Avatar, InfoIcon } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Group } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, imageExpoFormat, screens } from "../../../../utils";
import { styles } from "./Info.styles";
import * as statex$ from '../../../../state/local'

const groupController = new Group();

export function Info(props) {
  const { group, setGroup } = props;
  const { accessToken } = useAuth();
  const navigation = useNavigation();

  const openGallery = async () => {

    if(statex$.default.flags.offline.get()=='true'){
      Alert.alert ('Sin conexion a internet. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
          [{  text: 'Ok',
              onPress: async ()=>{
                console.log('modo offline!');
                statex$.default.flags.offline.set('true');
              }
        } ]);
  }else{
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      updateImage(result.assets[0].uri);
    }
  }

    
  };

  const updateImage = async (uri) => {
    try {
      const file = imageExpoFormat(uri);
      const response = await groupController.update(accessToken, group._id, {
        file,
      });

      setGroup({ ...group, image: response.image });
    } catch (error) {
      console.error(error);
    }
  };

  const openChangeNameGroup = () => {

    if(statex$.default.flags.offline.get()=='true'){
      Alert.alert ('Sin conexion a internet. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
          [{  text: 'Ok',
              onPress: async ()=>{
                console.log('modo offline!');
                statex$.default.flags.offline.set('true');
              }
        } ]);
    }else{
      navigation.navigate(screens.global.changeNameGroupScreen, {
        groupId: group._id,
        groupName: group.name,
      });
    }


    
  };

  return (
    <View style={styles.content}>
      <Pressable onPress={openGallery}>
        <Avatar
          bg="cyan.500"
          size="xl"
          source={{ uri: `${ENV.BASE_PATH}/${group.image}` }}
        />
      </Pressable>

      <Text style={styles.name} onPress={openChangeNameGroup}>
        {group.name} <InfoIcon />
      </Text>
      <Text style={styles.type}>Grupo</Text>
    </View>
  );
}