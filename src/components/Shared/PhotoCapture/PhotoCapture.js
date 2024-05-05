import { useState } from "react";
import { View } from "react-native";
import { IconButton, CloseIcon, Icon, Image, Spinner } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ChatMessage, GroupMessage } from "../../../api";
import { useAuth } from "../../../hooks";
import { imageExpoFormat } from "../../../utils";
import { styles } from "./PhotoCapture.styles";

const chatMessageController = new ChatMessage();
const groupMessageController = new GroupMessage();

export function PhotoCapture(props) {
  const { photo, type, id } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { accessToken,email } = useAuth();

  const sendMedia = async () => {
    try {
      setLoading(true);
      console.log("photo.uri")
      console.log(photo.uri)
      const file = imageExpoFormat(photo.uri);
      const img64=photo.base64;
      console.log("photo.file")
      console.log(file)

      //if (type === "chat") {
      //  await chatMessageController.sendImage(accessToken, id, file);
     // }
      if (type === "group") {
        console.log("sendind image to the group");
        console.log(file)
        //await groupMessageController.sendImage(accessToken, id, file);
        await groupMessageController.sendImageLocal(accessToken,id, file,email,img64);
      }

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} alt="photo" style={styles.photo} />

      <View style={styles.topActions}>
        <IconButton icon={null} />
        <IconButton
          onPress={navigation.goBack}
          icon={<CloseIcon style={styles.icon} size="8" />}
        />
        <IconButton icon={null} />
      </View>

      <View style={styles.bottomActions}>
        <IconButton icon={null} />

        {loading ? (
          <Spinner size="lg" />
        ) : (
          <IconButton
            onPress={sendMedia}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size="20"
                name="check-circle-outline"
                style={styles.icon}
              />
            }
          />
        )}

        <IconButton icon={null} />
      </View>
    </View>
  );
}