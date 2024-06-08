import { View, Text, Pressable } from "react-native";
import { Menu,Icon,AlertDialog,Button } from 'native-base';
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import AutoHeightImage from "react-native-auto-height-image";
import { useAuth } from "../../../../hooks";
import { ENV, screens } from "../../../../utils";
import { styled } from "./ItemImage.styles";
import { Auth } from "../../../../api"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EventRegister } from "react-native-event-listeners";
import mime from 'mime';
import * as FileSystem from 'expo-file-system';
import loadingImage from '../../../../assets/preloader.gif';
import * as statex$ from '../../../../state/local'

const authController = new Auth();

export function ItemImage(props) {

  const { message } = props;
  const { user } = useAuth();
  const isMe = user._id === message.user._id;
  const styles = styled(isMe);
  const createMessage = new Date(message.createdAt);
  const navigation = useNavigation();

  const imageUri = `${ENV.BASE_PATH}/${message.message}`;
  const [width, setWidth] = useState(240);
  const [modoAvanzado, setmodoAvanzado] = useState(false);
  const [showAdvertencia, setShowAdvertencia] = useState(false);
  const onCloseAdvertencia = () => setShowAdvertencia(false);
  const [mensajeEliminar, setMensajeEliminar] = useState(null);
  const [forwarded, setForwarded] = useState(false);
  const [isConnected,setIsConnected]=useState(false)    

  const onEliminarMensaje = () => {


    setShowAdvertencia(false);
    console.log("eliminando message:::::::::::");
                         
    //delete
    //persist changes
    //reoad mesages
    EventRegister.emit("deletingMessage",mensajeEliminar);  //
    setMensajeEliminar(null);
  }

  const onEliminarMensajeParaMi = () => {

    setShowAdvertencia(false);
    console.log("eliminando message para mi:::::::::::");
                         
    EventRegister.emit("deletingMessageForMe",mensajeEliminar);  //
    setMensajeEliminar(null);
  }

  const onOpenImage = () => {
    console.log(imageUri)
    navigation.navigate(screens.global.imageFullScreen, { uri: imageUri });
  };


  //open file function
  const onOpenFile= async () => {
    
    const urlFile = `${ENV.BASE_PATH}/${message.message}`;
    const filename=message.message.replace("images/","");
    
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
  
  };

   //Identifica modo avanzado basado en el estatus de cifrado
   useEffect( () => {

    async function fetchData() {

      setIsConnected(statex$.default.isConnected.get())

      setForwarded(message.forwarded);
     // console.log("forwarded??")
     // console.log(message.forwarded)


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
           
         
              <View style={styles.rowMenu}>
                {/*Alias*/}
                <Text style={styles.identity}>
                  {message.user.firstname || message.user.lastname
                    ? `${message.user.firstname || ""} ${message.user.lastname || ""}`
                    : message.user.email.substring(0,23) }
                </Text>

                <Menu  w="190" trigger={triggerProps => {
                  return <Pressable style={styles.menu}  accessibilityLabel="More options menu" {...triggerProps}>
                          <Icon display={statex$.default.isConnected.get()?"flex":"none"}
                            as={MaterialCommunityIcons}
                            size="7"
                            name="arrow-down-drop-circle"
                            color="black"
                          />
                        </Pressable>;
                }}>
                    {/*responder*/}                  
                    <Menu.Item style={styles.menuItem}  
                        onPress={() => {
                     
                           console.log("responder message:::::::::::");
                           EventRegister.emit("replyingMessage",message);  //-->GroupForm
                        }}>
                         <View style={styles.contentMenuItem} >
                            <Text>Responder</Text>
                            <Icon
                            as={MaterialCommunityIcons}
                            size="7"
                            name="reply"
                            color="black"
                          />
                          </View>
                         
                    </Menu.Item>
                    {/*reenviar*/}
                    <Menu.Item  style={styles.menuItem}  
                        onPress={() => {
                     
                           console.log("reenviando message:::::::::::");
                           EventRegister.emit("forwardingMessage",message);  //-->GroupForm
                        }}>
                           <View style={styles.contentMenuItem} >
                              <Text>Reenviar</Text>
                              <Icon
                              style={{transform: [{rotateY: '180deg'}]}}
                              as={MaterialCommunityIcons}
                              size="7"
                              name="reply"
                              color="black"
                            />
                          </View>
                    </Menu.Item>
                   
                    <Menu.Item  
                        onPress={() => {
                          onOpenFile();
                        }}>
                            <View style={styles.contentMenuItem} >
                            <Text>Descargar</Text>
                            <Icon
                            style={{marginTop:-5}}
                            as={MaterialCommunityIcons}
                            size="7"
                            name="download-circle"
                            color="red"
                          />
                          </View>
                    </Menu.Item>
                    <Menu.Item display={isMe?'flex':'none'}  
                        onPress={() => {
                         // alert('Eliminar: [  '+message.message+"  ]");
                          setMensajeEliminar(message);
                          setShowAdvertencia(true);
                          //reoad mesages
                            //
                        }}>
                             <View style={styles.contentMenuItem} >
                            <Text>Eliminar</Text>
                            <Icon
                            style={{marginTop:-5}}
                            as={MaterialCommunityIcons}
                            size="7"
                            name="delete"
                            color="red"
                          />
                          </View>
                    </Menu.Item>
                </Menu>

              </View>




            <Pressable onPress={onOpenImage}>
              <AutoHeightImage
                width={width}
                maxHeight={400}
                source={{ uri: imageUri }}
                style={styles.image}
              />
            </Pressable>

            <View style={styles.colFile}>
                    
                <Text style={styles.cifrado}>{"AES"}</Text>
                <Text style={styles.date}>
                  {DateTime.fromISO(createMessage.toISOString()).toFormat("dd/MM/yy    HH:mm")}
                </Text>



                {/*message forwarded*/}
                <View display={forwarded?"flex":"none"} style={{ alignItems:'center',flexDirection:'row',flex:2 }}>
                    <Icon
                      style={{transform: [{rotateY: '180deg'}]}}
                      as={MaterialCommunityIcons}
                      size="7"
                      name="reply"
                      color="black"
                    />

                    <Text  style={styles.dateEditado}  >
                      {"Reenviado"}
                    </Text>
                </View>



                </View>

            </View>


          <AlertDialog  isOpen={showAdvertencia} onClose={onCloseAdvertencia}>
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Eliminar imagen</AlertDialog.Header>
                <AlertDialog.Body>
                  Esta apunto de eliminar la imagen
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button variant="unstyled" colorScheme="coolGray" onPress={onCloseAdvertencia} >
                      Cancelar
                    </Button>
                    <Button colorScheme="warning" onPress={onEliminarMensajeParaMi}>
                      Para mi
                    </Button>
                    <Button colorScheme="danger" onPress={onEliminarMensaje}>
                      Para todos
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
              {DateTime.fromISO(createMessage.toISOString()).toFormat("Hdd/MM/yy    H:mm")}
            </Text>
          </View>
        </View>
      );
}


}