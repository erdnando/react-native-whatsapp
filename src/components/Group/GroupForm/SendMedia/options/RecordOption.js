import { Actionsheet, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { screens } from "../../../../../utils";
import { styles } from "../SendMedia.styles";

export function RecordOption(props) {
  const { onClose, groupId } = props;
  const navigation = useNavigation();

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    const micro = await Camera.requestMicrophonePermissionsAsync()

    //console.log("micro")
    //console.log(micro)

    if (status !== "granted" && micro.status !="granted") {
      console.error("No has acepatdo los permisos de la camara y el microfono");
    } else {
      onClose();
      navigation.navigate(screens.global.recordCameraScreen, {
        type: "group",
        id: groupId,
      });
    }
  };

  return (
    <Actionsheet.Item
      style={[styles.option, styles.optionRecordIcon]}
      _text={styles.optionRecordText}
      onPress={openCamera}
      startIcon={
        <Icon
          as={MaterialCommunityIcons}
          size="10"
          name="record-rec"
          color="white"
        />
      }
    >
    Video
    </Actionsheet.Item>
  );
}