import { Actionsheet, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";
import { GroupMessage } from "../../../../../api";
import { fileExpoFormat } from "../../../../../utils";
import { styles } from "../SendMedia.styles";
import * as FileSystem from 'expo-file-system';

const groupMessageController = new GroupMessage();

export function FileOption(props) {
  const { onClose, groupId, accessToken, email } = props;

  const openFileGallery = async () => {
    
    //
    const result = await DocumentPicker.getDocumentAsync({
      mimeType:["application/*","audio/*","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","vnd.ms-excel","vnd.openxmlformats-officedocument.spreadsheetml.sheet","text/csv"],
      copyToCacheDirectory:true,               
      allowsEditing: false,
      quality: 1
    });

    if (!result.canceled) {
      sendFile(result.assets[0].uri);
    }
  };

  const sendFile = async (uri) => {
    try {
      const file = fileExpoFormat(uri);
      console.log("file enviado ::");
      console.log(file);
      //console.log("uri enviado ::");
      console.log(uri)

      if(uri.endsWith(".jpg") || uri.endsWith(".jpeg") || uri.endsWith(".png")||uri.endsWith(".gif")||uri.endsWith(".bpm")){
        file.type="image/jpg";
        console.log("file enviadox ::");
        console.log(file);

        FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }).then((base64) => {
    
            groupMessageController.sendImageLocal(accessToken, groupId, file,email,base64);

        }).catch(error => {
              console.error(error);
        });
       
      }else{
        console.log("Archivo puro")
        console.log("file enviado ::");
        console.log(file.type);
        console.log(file.name);
        console.log(file);
        
          FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }).then((base64) => {
      
            groupMessageController.sendFileLocal(accessToken, groupId, file, email, base64);
            
          }).catch(error => {
                console.error(error);
          });
      }
    
      
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