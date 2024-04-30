import { useState } from "react";
import { Alert } from "react-native";
import { IconButton, Icon,AddIcon, Actionsheet } from "native-base";
import { useAuth } from "../../../../hooks";
import { GalleryOption, CameraOption, FileOption } from "./options";
import { styles } from "./SendMedia.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as statex$ from '../../../../state/local'

export function SendMedia(props) {
  const { groupId } = props;
  const [show, setShow] = useState(false);
  const { accessToken } = useAuth();

  const onOpenClose = () => {

    if(statex$.default.flags.offline.get()=='true'){
      Alert.alert ('Sin conexion a internet. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
          [{  text: 'Ok',
              onPress: async ()=>{
                console.log('modo offline!');
                statex$.default.flags.offline.set('true');
              }
        } ]);
  }else{
    setShow((prevState) => !prevState);
  }

    
  }


 
      return (
        <>
          {/*<IconButton icon={<AddIcon />} padding={0} paddingRight={2} onPress={onOpenClose}  />*/}
          <IconButton  icon={<Icon as={MaterialCommunityIcons} name="plus" style={styles.iconCamera} /> }  onPress={onOpenClose}    />
          
          <Actionsheet isOpen={show} onClose={onOpenClose}>
            <Actionsheet.Content style={styles.itemsContainer}>

              <CameraOption onClose={onOpenClose} groupId={groupId} />
            {/*<GalleryOption
                onClose={onOpenClose}
                groupId={groupId}
                accessToken={accessToken}
              />
      */}

              <FileOption 
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