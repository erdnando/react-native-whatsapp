import { useState } from "react";
import { IconButton, Icon,AddIcon, Actionsheet } from "native-base";
import { useAuth } from "../../../../hooks";
import { GalleryOption, CameraOption } from "./options";
import { styles } from "./SendMedia.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function SendMedia(props) {
  const { groupId } = props;
  const [show, setShow] = useState(false);
  const { accessToken } = useAuth();

  const onOpenClose = () => setShow((prevState) => !prevState);

  return (
    <>
      {/*<IconButton icon={<AddIcon />} padding={0} paddingRight={2} onPress={onOpenClose}  />*/}
      <IconButton icon={<Icon as={MaterialCommunityIcons} name="paperclip"  /> } padding={0} paddingRight={1} onPress={onOpenClose}  />
      
      <Actionsheet isOpen={show} onClose={onOpenClose}>
        <Actionsheet.Content style={styles.itemsContainer}>
          <CameraOption onClose={onOpenClose} groupId={groupId} />
          <GalleryOption
            onClose={onOpenClose}
            groupId={groupId}
            accessToken={accessToken}
          />

          <Actionsheet.Item
            style={[styles.option, styles.cancel]}
            _text={styles.cancelText}
            onPress={onOpenClose}
          >
            Cancelar
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
