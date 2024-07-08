import { useState } from "react";
import { Video } from 'expo-av';
import { View } from "react-native";
import { IconButton, CloseIcon, Icon, Image, Spinner } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ChatMessage, GroupMessage } from "../../../api";
import { useAuth } from "../../../hooks";
import { videoExpoFormat } from "../../../utils";
import { styles } from "./VideoCapture.styles";
import * as FileSystem from 'expo-file-system';

//const chatMessageController = new ChatMessage();
const groupMessageController = new GroupMessage();

export function VideoCapture(props) {
  const { video, type, id } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { accessToken,email } = useAuth();

  const sendMedia = async () => {
    try {
      setLoading(true);
     // console.log("video.uri")
      //console.log(video.uri)

      const file = videoExpoFormat(video.uri);
     // console.log("video")
     // console.log(video)
     // const image64=video.base64;//ok

     // console.log("video.file")
     // console.log(file)

  
     
       // console.log("sendind video to the group");
      //  console.log(file)
        //=================================================================================================
        /*FileSystem.readAsStringAsync(video.uri, { encoding: FileSystem.EncodingType.Base64 }).then((base64) => {*/
          //console.log(base64)
    
         //send video to the group....
         groupMessageController.sendFile( accessToken, id, file );//, email,base64
         setLoading(false);
         navigation.goBack();
/*
        }).catch(error => {
              console.error(error);
              setLoading(false);
        });*/
        //=================================================================================================
      
        
      

     
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Video alt="video" style={styles.video}
        source={{uri:video.uri}}
        useNativeControls
        resizeMode="contain"
        isLooping
      ></Video>


     {/*Btn cancel video & back*/}
      <View style={styles.topActions}>
        <IconButton
          onPress={navigation.goBack}
          icon={<CloseIcon style={styles.icon} size="8" />}
        />
      </View>

     {/*Btn send video*/}
      <View style={styles.bottomActions}>
        {loading ? ( <Spinner size="lg" />) : (
          <View>

              <IconButton
                onPress={sendMedia}
                icon={
                  <Icon
                    as={MaterialCommunityIcons}
                    size="20"
                    name="check-circle-outline"
                    style={styles.icon}
                  />
                }
              />

             
          </View>
          

          
        )}
      </View>



    </View>
  );
}