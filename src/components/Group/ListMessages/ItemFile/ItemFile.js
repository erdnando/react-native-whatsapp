import { View, Text, Pressable } from "react-native";
import { Menu,Icon,AlertDialog,Button } from 'native-base';
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import AutoHeightImage from "react-native-auto-height-image";
import { useAuth } from "../../../../hooks";
import { ENV, screens } from "../../../../utils";
import { styled } from "./ItemFile.styles";
import { Auth } from "../../../../api"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EventRegister } from "react-native-event-listeners";
import * as FileSystem from 'expo-file-system';
//import * as Permissions from 'expo-permissions';
//import * as MediaLibrary from 'expo-media-library';

//import { CameraRoll } from 'react-native';
//import * as WebBrowser from 'expo-web-browser';
import { shareAsync } from 'expo-sharing';
import mime from 'mime';


const authController = new Auth();

export function ItemFile(props) {

  const { message } = props;
  const { user } = useAuth();
  const isMe = user._id === message.user._id;
  const styles = styled(isMe);
  const createMessage = new Date(message.createdAt);
  const navigation = useNavigation();

  const imageUri = `${ENV.BASE_PATH}/${"images/cryptedImagex.png"}`;
  const [width, setWidth] = useState(240);
  const [modoAvanzado, setmodoAvanzado] = useState(false);
  const [showAdvertencia, setShowAdvertencia] = useState(false);
  const onCloseAdvertencia = () => setShowAdvertencia(false);
  const [mensajeEliminar, setMensajeEliminar] = useState(null);
  const [downloadProgress, setDownloadProgress]= useState(null);

  const onEliminarMensaje = () => {


    setShowAdvertencia(false);
    console.log("eliminando message:::::::::::");
 
    
    EventRegister.emit("deletingMessage",mensajeEliminar);  //
    setMensajeEliminar(null);
  }

  const onOpenImage = () => {
    navigation.navigate(screens.global.imageFullScreen, { uri: imageUri });
  };


//open file function
  const onOpenFile= async () => {
    
    const urlFile = `${ENV.BASE_PATH}/${message.message}`;
    const filename=message.message.replace("files/","");
    
    let mimetype =mime.getType(filename);
    console.log("mimetype::::::")
    console.log(mimetype)
    

    // Download the file and get its local URI
    const { uri } = await FileSystem.downloadAsync(urlFile,FileSystem.documentDirectory + filename);

    let fileInfo = await FileSystem.getInfoAsync(uri);
    console.log("fileInfo");
    console.log(fileInfo);

    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if(permissions.granted){

      const base64 = await FileSystem.readAsStringAsync(uri,{encoding:FileSystem.EncodingType.Base64});
      await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri,filename,mimetype).then(async (uri)=>{
        await FileSystem.writeAsStringAsync(uri,base64,{encoding:FileSystem.EncodingType.Base64})
      }).catch( e => {
        console.log(e)
      });

    }
    //else{
     // await shareAsync(uri);
    //}
   

  };

  
   //Identifica modo avanzado basado en el estatus de cifrado
   useEffect( () => {

  
    async function fetchData() {
     // console.log("useEffect ItemText:::::");
      const cifrado = await authController.getCifrado();
      //console.log("cifrado image item:::::"+cifrado);
      if(cifrado=="SI"){
        setWidth(120);
        setmodoAvanzado(false);
      }else{
        setWidth(240);
        setmodoAvanzado(true);
      }
    }
    fetchData();

  }, []);

  if(modoAvanzado){
      return (
        <View style={styles.content}>
          <View style={styles.message}>
           
           {/* {!isMe && (
              <Text style={styles.identity}>
                {message.user.firstname || message.user.lastname
                  ? `${message.user.firstname || ""} ${message.user.lastname || ""}`
                  : message.user.email}
              </Text>
            )}
          */}
              <View style={styles.rowMenu}>
                {/*Alias*/}
                <Text style={styles.identity}>
                  {message.user.firstname || message.user.lastname
                    ? `${message.user.firstname || ""} ${message.user.lastname || ""}`
                    : message.user.email.substring(0,23) }
                </Text>

                <Menu display={isMe?"flex":"none"} w="190" trigger={triggerProps => {
                  return <Pressable style={styles.menu}  accessibilityLabel="More options menu" {...triggerProps}>
                          <Icon display={isMe?"flex":"none"}
                            as={MaterialCommunityIcons}
                            size="7"
                            name="arrow-down-drop-circle"
                            color="black"
                          />
                        </Pressable>;
                }}>
                   
                    <Menu.Item  
                        onPress={() => {
                         // alert('Eliminar: [  '+message.message+"  ]");
                          setMensajeEliminar(message);
                          setShowAdvertencia(true);
                          //reoad mesages
                            //
                        }}>
                    Eliminar</Menu.Item>
                </Menu>

              </View>

              {/*vista file download*/}
              <View style={styles.rowFile}>
                  <Icon display={isMe?"flex":"none"}
                                as={MaterialCommunityIcons}
                                size="39"
                                name="file"
                                color="black"
                              />

               <Text style={styles.fileName}>
                  {message.message }
                </Text>

                  <Pressable onPress={onOpenFile}>
                    <Icon display={isMe?"flex":"none"}
                                  as={MaterialCommunityIcons}
                                  size="39"
                                  name="download-circle"
                                  color="black"
                                />
                  </Pressable>
              </View>

       
            <Text style={styles.date}>
              {DateTime.fromISO(createMessage.toISOString()).toFormat("HH:mm")}
            </Text>
          </View>


          <AlertDialog  isOpen={showAdvertencia} onClose={onCloseAdvertencia}>
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Eliminar archivo</AlertDialog.Header>
                <AlertDialog.Body>
                  Esta apunto de eliminar este archivo
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button variant="unstyled" colorScheme="coolGray" onPress={onCloseAdvertencia} >
                      Cancelar
                    </Button>
                   <Button colorScheme="danger" onPress={onEliminarMensaje}>
                      Eliminar archivo
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>


        </View>
      );
}else{
      return (
        <View style={styles.content}>
          <View style={styles.message}>
            {!isMe && (
              <Text style={styles.identity}>
                {message.user.firstname || message.user.lastname
                  ? `${message.user.firstname || ""} ${message.user.lastname || ""}`
                  : message.user.email}
              </Text>
            )}
            <Pressable onPress={onOpenImage}>
              <AutoHeightImage
                width={width}
                maxHeight={400}
                source={{ uri: imageUri }}
                style={styles.image}
              />
            </Pressable>
            <Text style={styles.date}>
              {DateTime.fromISO(createMessage.toISOString()).toFormat("HH:mm")}
            </Text>
          </View>
        </View>
      );
}


}
