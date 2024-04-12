import { Actionsheet, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";


import { GroupMessage } from "../../../../../api";
import { fileExpoFormat } from "../../../../../utils";
import { styles } from "../SendMedia.styles";

const groupMessageController = new GroupMessage();

export function FileOption(props) {
  const { onClose, groupId, accessToken } = props;

  const openFileGallery = async () => {
    
    //
    const result = await DocumentPicker.getDocumentAsync({
      type:["application/*","audio/*","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","vnd.ms-excel","vnd.openxmlformats-officedocument.spreadsheetml.sheet","text/csv"],
      copyToCacheDirectory:true,               
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      sendFile(result.assets[0].uri);
    }
  };

  const sendFile = async (uri) => {
    try {
      const file = fileExpoFormat(uri);
      console.log("file::");
      console.log(file);
      await groupMessageController.sendFile(accessToken, groupId, file);
      onClose();
    } catch (error) {
      console.log("error::");
      console.error(error);
    }
  };

  return (
    <Actionsheet.Item
      style={[styles.option, styles.optionEnd]}
      _text={styles.optionText}
      onPress={openFileGallery}
      startIcon={
        <Icon
          as={MaterialCommunityIcons}
          size="6"
          name="file-tree"
          color="white"
        />
      }
    >
      Archivos
    </Actionsheet.Item>
  );
}
