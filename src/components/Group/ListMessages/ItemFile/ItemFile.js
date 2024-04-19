import { View, Text, Pressable } from "react-native";
import { Menu,Icon,AlertDialog,Button,Box } from 'native-base';
import { useState, useEffect,useRef } from "react";
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
import { Audio } from 'expo-av';
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
  const [IsPLaying,SetIsPLaying]=useState(false)
  const [isPressed,setIsPressed]=useState(false)
  const [isHovered,setIsHovered]=useState(false)


  const onEliminarMensaje = () => {


    setShowAdvertencia(false);
    console.log("eliminando message:::::::::::");
 
    
    EventRegister.emit("deletingMessage",mensajeEliminar);  //
    setMensajeEliminar(null);
  }

  const onOpenImage = () => {
    navigation.navigate(screens.global.imageFullScreen, { uri: imageUri });
  };


  const AudioPlayer = useRef(new Audio.Sound());
 
   // Function to play the recorded audio
   const PlayRecordedAudio = async () => {
    try {
      setIsPressed(true);

      console.log("playing recordedURI:::::::");
      
      const recordedURIx = `${ENV.BASE_PATH}/${message.message}`;
      //const recordedURIx=urlFile.replace("files/","");
      console.log(recordedURIx);

      //release resources
      try {
        await AudioPlayer.current.unloadAsync();
      } catch (error) {
        console.log("maybe it fails if it;s the first time")
        console.log(error);
      }
       
      
      

      // Load the Recorded URI
      await AudioPlayer.current.loadAsync({ uri: recordedURIx }, {}, true);

      // Get Player Status
      const playerStatus = await AudioPlayer.current.getStatusAsync();

      // Play if song is loaded successfully
      if (playerStatus.isLoaded) {
        if (playerStatus.isPlaying === false) {
          AudioPlayer.current.playAsync();
          SetIsPLaying(true);
        }
      }
    } catch (error) {
      console.log("Error on PlayingRecording")
      console.log(error)
    }

    setIsPressed(false);
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

                {/*any other file*/}
                <View display={message?.message.toString().endsWith(".mp3") ?"none":"flex"}>
                   <Icon display={isMe?"flex":"none"}
                                as={MaterialCommunityIcons}
                                size="39"
                                name="file"
                                color="black"
                              />
                </View>
                 {/*just to mp3 files*/}
                <View display={message?.message.toString().endsWith(".mp3") ?"flex":"none"}>
                  

                     
                <Pressable onPress={PlayRecordedAudio}>
                  <View>
                    <Icon  style={{color:isPressed ? "gray":"black",   transform: [{scale: isPressed ? 0.96 : 1.2 }]}}
                        as={MaterialCommunityIcons}
                        size="49"
                        name="play"
                        color="black"
                      />
                  </View>
                      
                      </Pressable>
                      
                </View>
                  

               <Text style={styles.fileName}>
                  {message.message.replace("files/","") }
                </Text>

                 

                <Pressable onPress={onOpenFile} >
                    <Icon display={isMe?"flex":"none"} style={{marginTop:10}}
                                  as={MaterialCommunityIcons}
                                  size="30"
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
