import { useState, useEffect } from "react";
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
  const [connectStatus,setConnectStatus]=useState(false)
  const { accessToken,email } = useAuth();

  const onOpenClose = () => {
    setShow((prevState) => !prevState);
  }

  const alertaNoInternet = ()=>{
    Alert.alert ('Modo offline. ','La aplicacion esta en modo offline, por lo que no podra generar nuevos mensajes u operaciones',
      [{  text: 'Ok',
          onPress: async ()=>{
            statex$.default.flags.connectStatus.set(false);
          }
        } ]);
  }

  useEffect(() => {
  if(statex$.default.flags.connectStatus.get()){
    setConnectStatus(true)//original true
  }else{
    setConnectStatus(false)
  }
},[]);

 
      return (
        <>
          {/*<IconButton icon={<AddIcon />} padding={0} paddingRight={2} onPress={onOpenClose}  />*/}
          <IconButton  icon={<Icon as={MaterialCommunityIcons} name="plus" style={styles.iconCamera} /> }  onPress={connectStatus ? onOpenClose: alertaNoInternet}    />
          
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
                email={email}
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