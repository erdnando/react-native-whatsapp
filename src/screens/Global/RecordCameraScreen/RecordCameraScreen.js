import { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { IconButton, CloseIcon, Icon } from "native-base";
import { Camera } from "expo-camera/legacy";
import useInterval from 'use-interval'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VideoCapture } from "../../../components/Shared";
import { styles } from "./RecordCameraScreen.styles";

export function RecordCameraScreen() {

  const navigation = useNavigation();
  const { params } = useRoute();
  const [video, setVideo] = useState(null);
  const [msgrecord, setMsgrecord] = useState("Grabar video");
  const [isRecording, setIsRecording] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [vuelta, setVuelta] = useState(null);

  //Referencia a la camara
  const cameraRef = useRef();

  const onClose = () => navigation.goBack();

  const opacityx = useRef(new Animated.Value(1)).current; 

  useInterval(() => {
    // Your custom logic here
    console.log(seconds);
    setSeconds(seconds+1);

    if(seconds==59){
      setMinutes(minutes+1);
      setSeconds(0)
    }
  }, vuelta); // passing null instead of 1000 will cancel the interval if it is already running
 



 //config de la animacion para la generacion dle audio
 useEffect(() => {

 


}, [opacityx]);


  const recordVideo = async () => {

    setMsgrecord("Detener");
    setIsRecording(true);
    console.log("Iniciando grabacion...");

    setSeconds(0)
    setMinutes(0)
    setVuelta(1000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityx, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacityx, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        })
      ])
    ).start();


    
    //0` means compress for small size, and `1` means compress for maximum quality.
    //const options = { quality: 0.1,base64:true };//quality from 0.1 to 1.0
   
    const options={
      maxDuration: 60, //seconds
      quality: "480p",//"1080p",720p,480p
      mute: false,
      }
    const newVideo = await cameraRef.current.recordAsync(options).then((recordedVideo) => {
      console.log("newVideo")
      console.log("Grabacion terminada, preparada para envier...")
      setMsgrecord("Detener");
      setVideo(recordedVideo);
  
    });

    
  };

  const stopRecordVideo = async () => {

    if(vuelta==null){
      console.log("nada q hacer!!!")
      return;
    }
    setVuelta(null);



    console.log("en stopRecordVideo, dandole stop")
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
            
                <Animated.View style={{ opacity: opacityx }}>

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

                </Animated.View>
                <Pressable  onPress={ isRecording ? stopRecordVideo :recordVideo }
                style={{width:100, backgroundColor:'white',alignContent:'center', alignItems:'center', opacity:0.7, borderRadius:8}} >
                   <Text style={styles.text}>{msgrecord}</Text>
                  <Text style={{marginTop:5,marginLet:12, fontWeight:'bold',fontSize:16}}>{minutes<10 ? "0"+minutes:minutes}:{seconds<10 ? "0"+seconds:seconds}</Text>
                </Pressable>
                
               
               
      </View>


    </Camera>
  );
}