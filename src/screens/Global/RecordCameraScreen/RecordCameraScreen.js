import { useState, useRef, useEffect } from "react";
import { View, Text, Button, Pressable } from "react-native";
import { IconButton, CloseIcon, Icon } from "native-base";
import { Camera, FlashMode, CameraType } from "expo-camera/legacy";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VideoCapture } from "../../../components/Shared";
import { styles } from "./RecordCameraScreen.styles";

export function RecordCameraScreen() {

  const navigation = useNavigation();
  const { params } = useRoute();
  const [video, setVideo] = useState(null);
  const [msgrecord, setMsgrecord] = useState("Grabar video");
 // const [flashOn, setFlashOn] = useState(false);
  //const [cameraBack, setCameraBack] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  //Referencia a la camara
  const cameraRef = useRef();

  const onClose = () => navigation.goBack();
  const onOffFlash = () => setFlashOn((prevState) => !prevState);
  const changeTypeCamera = () => setCameraBack((prevState) => !prevState);

  useEffect(() => {
    setMsgrecord("Grabar video")
  
    
  }, [msgrecord])
  


  const recordVideo = async () => {

    setIsRecording(true);
    setMsgrecord("Detener grabacion")
    //0` means compress for small size, and `1` means compress for maximum quality.
    //const options = { quality: 0.1,base64:true };//quality from 0.1 to 1.0
    const options={
      maxDuration: 60, //seconds
      quality: "720p",//"1080p",
      mute: false,
      }
    const newVideo = await cameraRef.current.recordAsync(options).then((recordedVideo) => {
      console.log("newVideo")
      //console.log(recordedVideo)
      setVideo(recordedVideo);
      setIsRecording(false);
      setMsgrecord("Grabar video")
    });

    
  };

  const stopRecordVideo = async () => {
    setIsRecording(false);
    setMsgrecord("Grabar video")
    cameraRef.current.stopRecording();
  }



  if (video) {
    //Control camara, lista para tomar el video
    return <VideoCapture video={video} type={params.type} id={params.id} />;
  }

  return (
    //Vista de la foto tomada
    <Camera
      ref={cameraRef}
      style={styles.container}
    >
      {/*close camera*/}
      <View style={styles.topActions}>
        <IconButton
          icon={<CloseIcon style={styles.iconclose} />}
          onPress={onClose}
        />
      </View>

       {/*Record video button*/}
      <View style={styles.bottomActions}>
        <IconButton
          onPress={ isRecording ? stopRecordVideo :recordVideo }
          icon={
            <Icon
              as={MaterialCommunityIcons}
              size="20"
              name="record-rec"
              style={styles.icon}
            />
          }
        />
      
      <Pressable style={styles.button} >
      <Text style={styles.text}>{msgrecord}</Text>
    </Pressable>

         
      </View>
    </Camera>
  );
}