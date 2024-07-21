import { useState, useEffect,useRef } from "react";
import { View, Keyboard, Platform,TextInput,Text,Animated, Alert } from "react-native";
import {  IconButton, Icon, Select,Actionsheet,useDisclose,Checkbox,VStack,Button,ScrollView,
          useTheme,Center,Box,Heading,HStack,Spinner, useToast } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { GroupMessage,Group } from "../../../api";
import { useAuth } from "../../../hooks";
import { SendMedia } from "./SendMedia";
import { initialValues, validationSchema } from "./GroupForm.form";
import { styles } from "./GroupForm.styles";
import { EventRegister } from "react-native-event-listeners";
import { Audio, InterruptionModeAndroid } from 'expo-av';
import useInterval from 'use-interval'
import { fileExpoFormat } from "../../../utils";
import * as statex$ from '../../../state/local';
//import * as Notifications from "expo-notifications";
import * as Haptics from 'expo-haptics';

const groupMessageController = new GroupMessage();
const groupController = new Group();

/*Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});*/

export function GroupForm(props) {

  const { groupId, tipo } = props;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { accessToken,user } = useAuth();
  let [tipoCifrado, setTipoCifrado] = useState("AES");
  let [idMessage, setIdMessage] = useState("");
  const [focusInput, setFocusInput] = useState(false);
  const inputMessageRef=useRef(null);
  const [showIconSendText, setShowIconSendText] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(false);
  const [groups, setGroups] = useState(null);
  const [canForward, setCanForward] = useState(false);
  const toast = useToast();
  
  // Refs for the audio
  const AudioRecorder = useRef(new Audio.Recording());
  const AudioPlayer = useRef(new Audio.Sound());

  // States for UI
  const [recordedURI, setRecordedURI] = useState("");
  let recordedURIx = useRef("")
  const [AudioPermission, SetAudioPermission] = useState(false);
  const [IsRecording, SetIsRecording] = useState(false);//test
  const [IsPLaying, SetIsPLaying] = useState(false);
  const [hasFinishedAudio, setHasFinishedAudio] = useState(false);
  const [showRedRecord, setShowRedRecord] = useState(false);
  const [canCancelAudio, setCanCancelAudio] = useState(false);
  const [ mensajeAudio, setMensajeAudio]= useState("Grabando audio...")
  

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [vuelta, setVuelta] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [opacity2, setOpacity2] = useState(1)
  const opacityx = useRef(new Animated.Value(0)).current; 

  useInterval(() => {

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    //let second2 = seconds==0?1:seconds
    let valuee= seconds % 2 ==0 ? 0 : 1
    //console.log("opacity2")
    //console.log(valuee)
    setOpacity2(valuee)


    // Your custom logic here
    //console.log(seconds);
    setSeconds(seconds+1);

    if(seconds==59){
      setMinutes(minutes+1);
      setSeconds(0)
    }

    //console.log("running time...")

    
  }, vuelta); // passing null instead of 1000 will cancel the interval if it is already running
 
 
  //config de la animacion para la generacion dle audio
  useEffect(() => {

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

  
  }, [opacityx]);


  // Initial Load to get the audio permission
  useEffect(() => {
    GetPermission();
  }, []);
      

  // Function to get the audio permission
  const GetPermission = async () => {
    const getAudioPerm = await Audio.requestPermissionsAsync();
    SetAudioPermission(getAudioPerm.granted);
  };
//=======================================================================================
  // Function to start recording
  const StartRecording = async () => {

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    setMensajeAudio("Grabando audio...")
    setSeconds(0)
    setMinutes(0)
    setVuelta(1000);

    
      try {
        // Check if user has given the permission to record
        if (AudioPermission === true) {
          try {

            const RECORDING_OPTIONS_PRESET_LOW_QUALITY = {
              android: {
                  extension: '.mp3',
                  outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                  audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
                  sampleRate: 44100,
                  numberOfChannels: 2,
                  bitRate: 128000,
              },
              ios: {
                  extension: '.wav',
                  audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
                  sampleRate: 44100,
                  numberOfChannels: 2,
                  bitRate: 128000,
                  linearPCMBitDepth: 16,
                  linearPCMIsBigEndian: false,
                  linearPCMIsFloat: false,
              },
          };


            // Prepare the Audio Recorder
            
            //await AudioRecorder.current.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY );
            await AudioRecorder.current.prepareToRecordAsync(RECORDING_OPTIONS_PRESET_LOW_QUALITY);
            // Start recording
            await AudioRecorder.current.startAsync();
            SetIsRecording(true);
            setHasFinishedAudio(true)
            setShowRedRecord(true);
            setCanCancelAudio(false)
          } catch (error) {
           // console.log("Error on preparing audio obj")
            console.log(error);
          }
        } else {
          // If user has not given the permission to record, then ask for permission
          GetPermission();
        }
      } catch (error) {
        console.log("Error on StartRecording")
        console.log(error)
      }
  };


  const cancelAudio = ()=>{
    //console.log("canceling audio......")
    SetIsRecording(false);
    setHasFinishedAudio(false)
    setShowRedRecord(false);
    setCanCancelAudio(false)
  }
//=======================================================================================
  // Function to STOP RECORDING!!!!
  const StopRecording = async () => {
    setMensajeAudio("Audio listo!")
    if(vuelta==null){
      console.log("nada q hacer!!!")
      return;
    }
    setVuelta(null);
    
    try {
     
      // Stop recording
      await AudioRecorder.current.stopAndUnloadAsync();

      // Get the recorded URI here
      const result = AudioRecorder.current.getURI();
      
      setRecordedURI(result);//recordedURI
      recordedURIx=result;
      //if (result) setRecordedURI(result);
      
      // Reset the Audio Recorder
      AudioRecorder.current = new Audio.Recording();
      //SetIsRecording(false);//<-------------------------------------0
      setHasFinishedAudio(true);
      setShowRedRecord(false)
      setCanCancelAudio(true)

      console.log("recordedURI:::::::");
      console.log(recordedURIx);

      //==============================================
      //playing after stopping!!!!!!!!! just to test it
      //await PlayRecordedAudio();
      //==============================================

      //await sendAudio(recordedURIx)  //<-----------------------------0
      //console.log("playing recordedURI:::::::");
      //console.log(recordedURIx);
      //===============================================
    } catch (error) {
      console.log("Error on StopRecording")
      console.log(error)
    }
  };
//=======================================================================================
  // Function to play the recorded audio
  const PlayRecordedAudio = async () => {
      try {

      //  console.log("playing recordedURI:::::::1");
      //  console.log(recordedURIx);

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
  };

   // Function to STOP the playing audio
   const StopPlaying = async () => {

    try {
      //Get Player Status
      const playerStatus = await AudioPlayer.current.getStatusAsync();

      // If song is playing then stop it
      if (playerStatus.isLoaded === true)
        await AudioPlayer.current.unloadAsync();

      SetIsPLaying(false);
    } catch (error) {
      console.log("Error on Stopping player")
    }
  };

  const sendAudio = async () => {
    const uri = recordedURI;

    SetIsRecording(false);
    setHasFinishedAudio(false)
    setShowRedRecord(false);
    setCanCancelAudio(false)


    try {
      const file = fileExpoFormat(uri);
      //console.log("file::");
     // console.log(file);
      await groupMessageController.sendFile(accessToken, groupId, file);
      

    } catch (error) {

      console.log("error al enviar audio::"+uri);
      console.error(error);

    }
  };

  
//updating checkBoxes status of the list
  const handleStatusChange = index => {

    setGroups(prevList => {
      const newList = [...prevList];
      newList[index].isSelected = !newList[index].isSelected;
      return newList;
    });

      //evaluating selected status
      setCanForward(false);
      groups.map((msgx) => {
        if(msgx.isSelected){
          setCanForward(true);
        } 
      });
    // console.log(groups);

  };

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  const {
    colors
  } = useTheme();


  //Evento que lanza el forwarding, basado en los grupos seleccioandos
  const handleForward= ()=>{

    if(statex$.default.llaveGrupoSelected.get()==undefined){

      Alert.alert ('LLave requerida. ','Para poder enviar mensajes, es necesario ingresar la llave. Por favor ingrese su llave que le han compartido',
      [{  text: 'Ok',      } ]);
      return;
    }
       
      //console.log("sending msg into selected group:::::::::::");
    
      groups.map(async (gpo) => {

        if(gpo.isSelected){
         // console.log("-->")
         // console.log(forwardMessage)
         // console.log(gpo)
          //TODO validat tipo cifrado, no llega l mensaje destino
          if(forwardMessage.type=="TEXT"){
          
            await groupMessageController.sendText(accessToken , gpo._id , "reenviado::"+forwardMessage.message, forwardMessage.tipo_cifrado, null );
          }
          else if(forwardMessage.type=="IMAGE"){
            
            await groupMessageController.sendTextForwardImage(accessToken , gpo._id , forwardMessage.message, "BASE64" );
          }
          else if(forwardMessage.type=="FILE"){
            
            await groupMessageController.sendTextForwardFile(accessToken , gpo._id , forwardMessage.message, "BASE64" );
          }

        } 
      });
      onClose();
    
      
   
  }

  const handleFocus = () => {
    //console.log("foco puesto....")
    //setFocusInput(true);
    setShowIconSendText(true);
  };
  
  const handleBlur = () => {
    //console.log("foco perdido....")
    //setFocusInput(true);
    setShowIconSendText(false);
  };

  const onCancelReply = () => {
    console.log("cancelando reply...");
    setFocusInput(false);
    setReplyMessage(null);
    
  };

  //EventListener:loading
  useEffect(() => {
        //=================================================================
        const eventLoading = EventRegister.addEventListener("loadingEvent", async data=>{
         // console.log("loading::::::::::::::::::::::::::::::::::::;:::"+data)
          setIsLoading(data);    

          setFocusInput(false);
          setReplyMessage(null);
          setShowIconSendText(false);
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventLoading);
        }
        //================================================================
  }, []);

  //Manage keyboard
  useEffect(() => {
    const showKeyboardSub = Keyboard.addListener("keyboardDidShow", (e) => {
      const { startCoordinates } = e;

      if (Platform.OS === "ios") {
        setKeyboardHeight(startCoordinates.height + 65);
      }
    });

    const hideKeyboardSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      setIdMessage("");
    });

    return () => {
      showKeyboardSub.remove();
      hideKeyboardSub.remove();
    };
  }, []);


  //EventListener:forwardingMessage
  useEffect(() => {

      setIdMessage("");
    
        try {
          
          //=================================================================
          const eventForwardMessage = EventRegister.addEventListener("forwardingMessage", async data=>{
           // console.log("grupo desde donde salio el forward::::")
           // console.log(data.group);
            setForwardMessage(true);
            //get groups from API
       
              onOpen();
                try {

                  setForwardMessage(data);
                  //Get all messages
                  const response = await groupController.getAll(accessToken);
        
                  const result = response.filter(gpo => gpo._id != data.group).sort((a, b) => {
                    return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
                  });


                  //addin isSelected property on runtime
                  result.map((gpo) => {
                      gpo.isSelected =false;
                  });
                 
                 // console.log("obteniendo grupos para actionSheet....")
                  //Revisar en el click del action button -->  handleForward()
                 // console.log(result)
                  setGroups(result);
                 
                } catch (error) {
                  console.error(error);
                }
           
            
          });
      
          return ()=>{
            EventRegister.removeEventListener(eventForwardMessage);
          }
          //================================================================
          
  
        } catch (error) {
          console.error(error);
        }
    
    }, []);


  //EventListener:replyingMessage
  useEffect(() => {

      setIdMessage("");
    
        try {
          
          //=================================================================
          const eventReplyMessage = EventRegister.addEventListener("replyingMessage", async data=>{
            setIdMessage("");
            setFocusInput(true);
           // console.log("mensaje replicado::::")
            //console.log(data)
            setReplyMessage(data);
            inputMessageRef.current.focus();
            
          });
      
          return ()=>{
            EventRegister.removeEventListener(eventReplyMessage);
          }
          //================================================================
          
  
        } catch (error) {
          console.error(error);
        }
    
    }, []);
    
  //EventListener:editingMessage
  useEffect(() => {

    setIdMessage("");
  
      try {
        
        //=================================================================
        const eventEditMessage = EventRegister.addEventListener("editingMessage", async data=>{
         // console.log("editado paso por aqui1")
          setIdMessage("");
          //console.log("message._id:"+data._id);
          setIdMessage(data._id);
         // console.log("message.message:"+data.message);
         // console.log("message.group:"+data.group);
          //console.log("message.tipo_cifrado:"+data.tipo_cifrado);
         // console.log("message.type:"+data.type);
          
          formik.setFieldValue("message", data.message);
          setFocusInput(true);
          inputMessageRef.current.focus();
          
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventEditMessage);
        }
        //================================================================
        

      } catch (error) {
        console.error(error);
      }
  
  }, []);

  //EventListener:deletingMessage
  useEffect(() => {

    setIdMessage("");
   
      try {
        
         //=================================================================
         const eventDeleteMessage = EventRegister.addEventListener("deletingMessage", async data=>{
          setIdMessage("");
         // console.log("message._id:"+data._id);
          setIdMessage(data._id);
          //console.log("message.message:"+data.message);
          //console.log("message.group:"+data.group);
         // console.log("message.tipo_cifrado:"+data.tipo_cifrado);
         // console.log("message.type:"+data.type);
          statex$.default.moveScroll.set(false);
    
         await groupMessageController.deleteMessage(accessToken , groupId , "", tipoCifrado,data._id );
         setIdMessage("");
        
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventDeleteMessage);
        }
        //================================================================

      } catch (error) {
        console.error(error);
      }
     
   // })();
  }, []);


  
  
  
  //formik definition & onsubmit
  const formik = useFormik({

    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {

      if(statex$.default.llaveGrupoSelected.get()==undefined){

        Alert.alert ('LLave requerida. ','Para poder enviar mensajes, es necesario ingresar la llave. Por favor ingrese su llave que le han compartido',
        [{  text: 'Ok',      } ]);
        return;
      }

      if(!statex$.default.isConnected.get()){
        Alert.alert ('Modo offline. ','La aplicacion esta en modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',      } ]);

        return;
      }

      if(formValue.message.trim().length==0){

        toast.show({
          placement: "top",
          render: () => {
            return <Box bg="#0891b2" px="4" py="3" rounded="md" mb={8} style={{borderTopColor:'white', borderTopWidth:3,color:'white', zIndex:3000 }}>
                  <Text style={{color:'white'}}>No puede enviar mensajes vacios!</Text>
  
                  </Box>;
          }
        });

        return;
      }


      //onSendMessage
      try {
        setKeyboardHeight(0);
        Keyboard.dismiss();
       
       // console.log("idMessage:::::::")
       // console.log(idMessage)
        //process();
       //Envio de mensajes
      // console.log("tipo cifrado::"+tipoCifrado);
      //console.log("editado paso por aqui 2::::"+idMessage)  
       if(idMessage==""){
        //llamada normal, nuevo mensaje
        //replyMessage==null if you like a normal message

       // console.log("===========sending replied=============")
       // console.log(replyMessage);
       // console.log("=======================================")
        //if replyMessage is null, then it's a normal message
        //else it's a reply
        await groupMessageController.sendText(accessToken , groupId , formValue.message , tipoCifrado, replyMessage, tipo );
       }else{
        //edicion de mensaje
        setIdMessage("");
        await groupMessageController.sendTextEditado(accessToken , groupId , formValue.message , tipoCifrado,idMessage, tipo );
       }
       setFocusInput(false);
       setReplyMessage(null);

        formik.handleReset();
        //clearing input after sending a message
        formik.setFieldValue("message", "");

  
        setIdMessage("");
        
      } catch (error) {
        console.error(error);
      }
    },
  });

  //console.log("isloading::::::::::::::::::::::::::::::::::::::::::::::::::;"+isLoading)
  if(isLoading){
  return (<View style={{position: "absolute",top:0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(60, 60, 60, 0)",
            justifyContent: "center",
            alignItems: "center",}}>
         <Spinner accessibilityLabel="Loading posts" size="xlg" color="transparent" />
          <Heading color="white" fontSize="lg">
          ...
          </Heading>
        </View>
        );  }
  
  return (
    <View style={[ { bottom: keyboardHeight }]}>

       
      {/*reply message section just as a reference to see what would you send*/}
      <Text display={replyMessage!=null?"flex":"none"} style={styles.identity}>
                  {replyMessage?.user.firstname || replyMessage?.user.lastname
                    ? `${replyMessage?.user.firstname || ""} ${replyMessage?.user.lastname || ""}`
                    : replyMessage?.user.email.substring(0,30) }
      </Text>
      <View display={replyMessage!=null?"flex":"none"} style={{flexDirection: 'row', marginLeft:5,marginRight:30,width:'90%' ,backgroundColor:'black',padding:10 }}>
        <Text style={styles.textReply}>{replyMessage!=null ? replyMessage.message: ""}</Text>
        <IconButton onPress={onCancelReply} icon={<Icon as={MaterialCommunityIcons} name="close" style={styles.iconCloseReply} /> } /> 
      </View>
    



      {/*1.- icon that show a red record*/}
      <View display={showRedRecord?"flex":"none"} style={{flexDirection:'row-reverse', marginRight:52,width:'90%' ,backgroundColor:'black',padding:10 }}>

      <Animated.View // Special animatable View
                          style={{
                            opacity: opacity2, // Bind opacity to animated value
                          }}>
                          <IconButton onPress={onCancelReply} icon={<Icon as={MaterialCommunityIcons} name="record-rec" style={styles.iconRecording} /> } />
                        </Animated.View>
           

       
      </View>

      
      {/*bottom section*/}
      <View style={styles.content}>

         {/* cboCrypto select */}
          <Select display={IsRecording?"none":"flex"} borderColor={'transparent'} paddingTop={0} paddingBottom={0} style={styles.select} minWidth={81} maxWidth={82} 
          selectedValue={tipoCifrado} dropdownIcon={<Icon as={MaterialCommunityIcons} name="key" style={styles.iconCrypto} />}
          onValueChange={itemValue => setTipoCifrado(itemValue)}>
              <Select.Item label="AES" value="AES" />
              <Select.Item label="3DES" value="3DES" />
              <Select.Item label="RCA" value="RCA" />
              <Select.Item label="RAB" value="RABBIT" />
          </Select>

          {/* Text message chat*/}
          <View display={IsRecording?"none":"flex"} style={styles.inputContainer}>

            <TextInput  
              ref={inputMessageRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              multiline
              borderColor= {focusInput ? 'red' : 'transparent'}
              placeholder="Mensaje al grupo..."
              placeholderTextColor="gray" 
              variant="unstyled"
              style={styles.input}
              value={formik.values.message}
              onChangeText={(text) => formik.setFieldValue("message", text)}
              onEndEditing={!formik.isSubmitting && formik.handleSubmit}
            />
            <IconButton display={showIconSendText ? 'flex':'none'}
              icon={<Icon as={MaterialCommunityIcons} name="send"  /> }
              style={styles.iconSend}
              onPress={!formik.isSubmitting && formik.handleSubmit}
            />
          </View>

          {/* Send media and microphone */}
          <View display={showIconSendText ? 'none':'flex'} style={ {flexDirection:'row',alignItems:'center' }}>
              <View display={IsRecording?"none":"flex"}>
                 <SendMedia  groupId={groupId}  />
              </View>
             
            {/* 2.- Recording timer!!!!! */}
             <View display={hasFinishedAudio?"flex":"none"} style={{flex:0,flexDirection:'row',alignContent:'space-between',    
                   width:'87%',borderRadius:10,marginRight:5, height:40,backgroundColor:'white'}}>
             
                      {/* icon to cancel audio */}
                      <View display={canCancelAudio ? "flex": 'none'}>
                                  <IconButton  icon={<Icon as={MaterialCommunityIcons} name="delete-forever"  style={styles.iconDelete} /> }  
                                              onPress={ cancelAudio} />
                      </View>

                      <View display={canCancelAudio ? "none": 'flex'}>
                        <Animated.View // Special animatable View
                          style={{
                            opacity: opacity2, // Bind opacity to animated value
                          }}>
                            {/* left icon that work with animation!!!!! */}
                          <Icon as={MaterialCommunityIcons} name="microphone"  style={styles.iconInnerAudio  }/>
                        </Animated.View>
                      </View>

                    

                {/* audio counter!!!!! */}
                <Text style={[canCancelAudio ? styles.contadorLeft : styles.contadorRight  ]} >
                      { minutes<10 ? "0"+minutes:minutes}:{seconds<10 ? "0"+seconds:seconds } {mensajeAudio}</Text>
            
             </View>

              {/* 3.- Microphone */}
              <IconButton display={canCancelAudio ? "none": 'flex'}  icon={<Icon as={MaterialCommunityIcons} name="microphone"  color={IsRecording ? 'white': 'gray'}
              style={[IsRecording ? styles.iconAudioRecording : styles.iconAudio  ]}
              /> }  
                onLongPress={ StartRecording} onPressOut={StopRecording} />

              <IconButton display={canCancelAudio ? "flex": 'none'}  icon={<Icon as={MaterialCommunityIcons} name="send" style={styles.iconSend2}
              /> }  
                onPress={ sendAudio}  />




          </View>
      </View>

      {/*forward group*/}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
       
            <View style={{height:260,width:'100%', padding:8}}>
              
            <Text style={{fontWeight:'bold',fontSize:16,marginBottom:5}} >Seleccione el grupo:</Text>
               <ScrollView h="full" style={{padding:8,borderRadius:8 }}>
               <Center w="100%">
                  <Box  w="100%" style={{paddingHorizontal:5}}>
                      <VStack space={4}>
                        {
                          groups?.map((group,index) => 
                          <HStack w="100%" justifyContent="space-between" alignItems="center" key={group._id.toString()}>

                              <Checkbox isChecked={group.isSelected} onChange={() => handleStatusChange(index)} value={group.name} aria-label={group.name}></Checkbox>
                              <Text width="100%" flexShrink={1} textAlign="left" mx="2" strikeThrough={group.isSelected} _light={{
                                    color: group.isSelected ? "gray.400" : "coolGray.800"}} _dark={{color: group.isSelected ? "gray.400" : "coolGray.50"
                                  }} onPress={() => console.log("actualizando estatus...")}>
                                    {"   "+group.name}
                              </Text>
                          </HStack>)
                          }
                      </VStack>
                  </Box>
                </Center>
              </ScrollView>


               <View style={{height:16}}></View>
               <Button isDisabled={canForward?false:true} style={{backgroundColor:'black'}}  onPress={handleForward}>Reenviar</Button>

               <View style={{height:0}}></View>
            </View>
        </Actionsheet.Content>
        </Actionsheet>


    </View>
  );
}