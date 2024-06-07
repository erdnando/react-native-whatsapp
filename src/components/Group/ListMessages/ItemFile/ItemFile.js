import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Menu,Icon,AlertDialog,Button,Modal, Center, Box, Spinner,  } from 'native-base';
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
import * as statex$ from '../../../../state/local'
import { Video } from 'expo-av';
import { Progress } from 'native-base';

const authController = new Auth();

export function ItemFile(props) {

  const { message } = props;
  const { user } = useAuth();
  const isMe = user._id === message.user._id;
  const styles = styled(isMe);
  const createMessage = new Date(message.createdAt);
  const navigation = useNavigation();

  const imageUri = `${ENV.BASE_PATH}/${"images/cryptedImagex.png"}`;
  const imageRealUri = `${ENV.BASE_PATH}/${message.message}`;
  const [width, setWidth] = useState(340);
  const [modoAvanzado, setmodoAvanzado] = useState(false);
  const [showAdvertencia, setShowAdvertencia] = useState(false);
  const onCloseAdvertencia = () => setShowAdvertencia(false);
  const [mensajeEliminar, setMensajeEliminar] = useState(null);
  const [downloadProgress, setDownloadProgress]= useState(null);
  const [IsPLaying,SetIsPLaying]=useState(false)
  const [isPressed,setIsPressed]=useState(false)
  const [isHovered,setIsHovered]=useState(false)
  const [realImage,setRealImage]=useState(false)
  const [forwarded, setForwarded] = useState(false);
  const [isConnected,setIsConnected]=useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [totalSize, setTotalSize] = useState(0)
  const [progressValue, setProgressValue] = useState(0)
  const [showProgressBar, setShowProgressBar] = useState(false)

  const onEliminarMensaje = () => {


    setShowAdvertencia(false);
    console.log("eliminando message:::::::::::");
 
    
    EventRegister.emit("deletingMessage",mensajeEliminar);  //
    setMensajeEliminar(null);
  }

  const onOpenImage = () => {
    navigation.navigate(screens.global.imageFullScreen, { uri: imageUri });
  };


  //const AudioPlayer = useRef(new Audio.Sound());
  //==========================================================================================
  const PlayRecordedAudio = async () => {

    const soundObject = new Audio.Sound();
    let duracionAudio=0;
    try {
      setIsPressed(true);

      console.log("playing recordedURI:::::::");

      const recordedURIx = `${ENV.BASE_PATH}/${message.message}`;
      console.log(recordedURIx);

      console.log("playing audio..");

      try {
        await soundObject.loadAsync({ uri: recordedURIx });
        const playerStatus = await soundObject.getStatusAsync();
        console.log("playerStatus")
        console.log(playerStatus.durationMillis)
        duracionAudio=playerStatus.durationMillis;


        SetIsPLaying(true)
        await soundObject.playAsync();
        
        await sleepNow(duracionAudio+500)
        
        SetIsPLaying(false);
        await soundObject.unloadAsync();
        
        
      } catch (error) {
        console.log(error)
      }

    } catch (error) {
      console.log("Error on PlayingRecording")
      console.log(error)
    }

    setIsPressed(false);
  }


  const handleVideoRef = async component => {

    const playbackObject = component;
    const urlFile = `${ENV.BASE_PATH}/${message.message}`;
    if (playbackObject) {
        await playbackObject.loadAsync( { uri: urlFile },  );
    }

  };


  const callback = downloadProgress => {
    /*setTotalSize(formatBytes(downloadProgress.totalBytesExpectedToWrite))

   */

    var progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    progress = progress.toFixed(2) * 100

    console.log(progress.toFixed(0))
    if(progress.toFixed(0)==100)setLoading(false);
  };


//  const downloadResumable = FileSystem.createDownloadResumable( videoUri, FileSystem.documentDirectory + 'small.mp4',  {},  callback );


  const PlayRecordedVideo = async () =>{
    
    console.log("openning video client...")

    setShowModal(true);
    setLoading(true);
    const urlFile = `${ENV.BASE_PATH}/${message.message}`;
    setVideoUri(urlFile)
    const filename=message.message.replace("files/","");
    
    let mimetype =mime.getType(filename);
    console.log("mimetype::::::")
    console.log(mimetype)
    console.log(urlFile)
    console.log(filename)
    
    //const downloadResumable = FileSystem.createDownloadResumable( urlFile, FileSystem.documentDirectory + filename,  {},  callback );
   // const { urix } = await downloadResumable.downloadAsync();
    //console.log('Finished downloading to ', urix);
    setLoading(false);
   
    

    


    
    
  }

  const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
  //--------------------------------------------------------------------------------------------


  //onDownload function
  const onDownload= async () => {
    
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
   

  };





  const formatBytes =(bytes, decimals = 2)=> {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  
  

  const onDownloadIndicator= async () => {

    try{
    setProgressValue(0)
    setShowProgressBar(true)

    const urlFile = `${ENV.BASE_PATH}/${message.message}`;
    const filename=message.message.replace("files/","");
    
    let mimetype =mime.getType(filename);
    console.log("mimetype::::::")
    console.log(mimetype);
    //=============================================================

    const callbackx = (downloadProgress) => {
      setTotalSize(formatBytes(downloadProgress.totalBytesExpectedToWrite))
  
      var progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      progress = progress.toFixed(2) * 100
      setProgressValue(progress.toFixed(0))
  
      console.log("Descargando archivo...")
      console.log(formatBytes(downloadProgress.totalBytesExpectedToWrite))
      console.log(progress.toFixed(0))
    };

    
    const downloadResumable = FileSystem.createDownloadResumable(
      urlFile,
      FileSystem.documentDirectory + filename,
      {},
      callbackx
    );

    

    

    const { uri } = await downloadResumable.downloadAsync();


    // Download the file and get its local URI
    //const { uri } = await FileSystem.downloadAsync(urlFile,FileSystem.documentDirectory + filename);

   // let fileInfo = await FileSystem.getInfoAsync(uri);
   // console.log("fileInfo");
   // console.log(fileInfo);

    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if(permissions.granted){

      const base64 = await FileSystem.readAsStringAsync(uri,{encoding:FileSystem.EncodingType.Base64});
      await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri,filename,mimetype).then(async (uri)=>{
        await FileSystem.writeAsStringAsync(uri,base64,{encoding:FileSystem.EncodingType.Base64})
      }).catch( e => {
        console.log(e)
        setProgressValue(0)
        setShowProgressBar(false)
      });

    }else{
      setProgressValue(0)
      setShowProgressBar(false)
    }
    setProgressValue(0)
    setShowProgressBar(false)

  }catch(exx){
    setProgressValue(0)
    setShowProgressBar(false)
  }

  };

  
   //Identifica modo avanzado basado en el estatus de cifrado
   useEffect( () => {

    
      setIsConnected(statex$.default.isConnected.get())
    

    if(message?.message.toString().endsWith(".jpg")||message?.message.toString().endsWith(".jpeg")||
       message?.message.toString().endsWith(".png")||message?.message.toString().endsWith(".bpm")){
        setRealImage(true)
    }
  
    async function fetchData() {

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
        setWidth(340);
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

                <Menu   w="180" trigger={triggerProps => {
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
                    {/*descargar*/}
                    <Menu.Item  
                        onPress={() => {
                          onDownloadIndicator();
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
                     {/*eliminar*/}
                     <Menu.Item display={isMe?'flex':'none'}   
                        onPress={() => {
                          setMensajeEliminar(message);
                          setShowAdvertencia(true);
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

              {/*Vista file  iconos y nombre del archivo*/}
              <View style={styles.rowFile}>

                {/*any other file different mp3 or mp4*/}
                <View display={message?.message.toString().endsWith(".mp3") || message?.message.toString().endsWith(".mp4") ? "none":"flex"}>
                   <Icon 
                      as={MaterialCommunityIcons}
                      size="39"
                      name="file"
                      color="black"
                    />
                </View>

                
                 {/*just to mp4 files*/}
                 <View display={message?.message.toString().endsWith(".mp4") ?"flex":"none"} >
                    <Pressable onPress={PlayRecordedVideo}>
                      <View>
                        <Icon  style={{ color:"black",borderWidth:1, borderRadius:8, shadowOffset:{width:-4, height:4}, shadowOpacity:0.4, shadowRadius:3  }}
                            as={MaterialCommunityIcons}
                            size="49"
                            name="movie-open-play"
                            color="black"
                          />
                      </View>   
                    </Pressable>
                </View>


                {/*just to mp3 files*/}
                <View display={message?.message.toString().endsWith(".mp3") ?"flex":"none"} >
                    <Pressable onPress={PlayRecordedAudio}>
                      <View>
                        <Icon  style={{color:IsPLaying ? "red":"black",   transform: [{scale: isPressed ? 1.4 : 1.2 }]}}
                            as={MaterialCommunityIcons}
                            size="49"
                            name="play"
                            color="black"
                          />
                      </View>   
                    </Pressable>
                </View>
                
                 {/*just to img files*/}
                 <View display={realImage ?"flex":"none"}>
                    <Pressable onPress={onOpenImage}>
                      <AutoHeightImage
                        width={width}
                        maxHeight={400}
                        source={{ uri: imageRealUri }}
                        style={styles.image}
                      />
                    </Pressable>
                </View>

               {/*Nombre del archivo*/}
               <Text display={realImage ?"none":"flex"} style={styles.fileName}>
                  {message.message.replace("files/","")}
               </Text>
                 
              </View>

              {/*Indicator just to mp4 files*/}
              <View display={ showProgressBar ? "flex":"none"} >
                   <Box w="93%" maxW="400">
                     <Progress colorScheme="secondary" value={progressValue} mx="4" style={{marginTop:-11, marginLeft:60}} />
                   </Box>
                
               </View>



              <Text display={ showProgressBar ? "flex":"none"} style={styles.totalSize} >{totalSize}</Text>
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


          <Modal isOpen={showModal} onClose={() => setShowModal(false)} presentationStyle="fullScreen" style={{flex: 1, alignItems: 'center', justifyContent: 'center',marginTop: -60,}}>
                  <Modal.Content  width="100%" height="100%" >
                      <Modal.CloseButton />

                      <Modal.Header style={{backgroundColor:'#0891b2',  }}>Video</Modal.Header>
                          <View style={styles.containerVideo}>
                                <Video 
                                  source={{ uri: `${ENV.BASE_PATH}/${message.message}` }}
                                  alt="video" style={styles.video}
                                  useNativeControls
                                  resizeMode="cover"
                                  shouldPlay={true}
                                  isLooping>
                                  <ActivityIndicator size={"small"} ></ActivityIndicator>
                                </Video>
                          </View>
                  </Modal.Content>
          </Modal>

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
              {DateTime.fromISO(createMessage.toISOString()).toFormat("dd/MM/yy    HH:mm")}
            </Text>
          </View>
        </View>
      );
}






}