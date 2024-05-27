import { View, Text, Pressable } from "react-native";
import { Avatar, InfoIcon } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Group } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV, imageExpoFormat, screens } from "../../../../utils";
import { styles } from "./Info.styles";

const groupController = new Group();

export function Info(props) {

  const { group, setGroup } = props;
  const { accessToken } = useAuth();
  const navigation = useNavigation();

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      updateImage(result.assets[0].uri);
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
    console.log("group detail::::")
    console.log(group)
    navigation.navigate(screens.global.changeNameGroupScreen, {
      groupId: group._id,
      groupName: group.name,
      tipo: group.tipo,
      creator: group.creator
    });
  };

  return (
    <View style={styles.content}>
     
        <Avatar
          bg="cyan.500"
          size="xl"
          source={{ uri: `${ENV.BASE_PATH}/group/group1.png` }}
        />
     
     <Pressable style={styles.contentEdit} onPress={openChangeNameGroup} >
      <Text style={styles.name} >
        {group.name} <InfoIcon />
      </Text>
      <Text style={styles.type}>(Presione para editar)</Text>
      </Pressable>
    </View>
  );
}