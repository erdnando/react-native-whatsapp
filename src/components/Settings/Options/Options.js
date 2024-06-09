import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { User } from "../../../api";
import { imageExpoFormat, screens } from "../../../utils";
import { styles } from "./Options.styles";
import * as statex$ from '../../../state/local'
import { Center, Flex, Icon, AlertDialog,Button ,TextArea } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GET_STATE_ALLMESSAGES,GET_STATE_ALLGROUP_LLAVE,GET_STATE_MY_DELETED_MESSAGES } from '../../../hooks/useDA';

const userController = new User();

export function Options(props) {

  const [isOpen, setIsOpen] = useState(false);
  const [datos, setDatos] = useState(false);

  const { accessToken, logout, updateUser } = props;
  const navigation = useNavigation();
 // const [isConnected, setIsConected] = useState(false);

  useEffect(() => {
    
   // setIsConected(statex$.default.isConnected.get())
  
  }, [])
  

  const onClose = () => setIsOpen(false);

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const file = imageExpoFormat(result.assets[0].uri);
      updateUserData({ avatar: file });
    }
  };

  const updateUserData = async (userData) => {
    try {
      const response = await userController.updateUser(accessToken, userData);
      updateUser("avatar", response.avatar);
    } catch (error) {
      console.error(error);
    }
  };

  const goChangeFirstname = () => {
    navigation.navigate(screens.tab.settings.changeFirstnameScreen);
  };

  const goChangeLastname = () => {
    navigation.navigate(screens.tab.settings.changeLastnameScreen);
  };

  
  const goDataView = async () => {
    //get data STATE_GROUP_LLAVE
    //GET_STATE_ALLGROUP_LLAVE
    await GET_STATE_MY_DELETED_MESSAGES().then(result =>{
      let response=result.rows._array;
      console.log(response)
      response =JSON.stringify(response);
      setDatos(response)
      }); 

    setIsOpen(true)
  };

  return (
    <View style={styles.content}>

      <TouchableOpacity style={styles.item} onPress={statex$.default.isConnected.get() ? openGallery : null} >
        <Flex direction="row"   >
          <Icon as={MaterialCommunityIcons} name="text-recognition" style={styles.iconOptions} />   
          <Center size={3}></Center>
          <Text style={styles.text}>Cambiar foto de perfil</Text>
        </Flex>
  </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={statex$.default.isConnected.get() ? goChangeFirstname : null}>
        <Flex direction="row"   >
          <Icon as={MaterialCommunityIcons} name="tooltip-edit-outline" style={styles.iconOptions} />   
          <Center size={3}></Center>
          <Text style={styles.text}>Definir alias</Text>
        </Flex>
       
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={statex$.default.isConnected.get() ? goChangeLastname : null}>
      <Flex direction="row"   >
          <Icon as={MaterialCommunityIcons} name="security" style={styles.iconOptions} />   
          <Center size={3}></Center>
          <Text style={styles.text}>Definir NIP</Text>
        </Flex>
      </TouchableOpacity>

      {/*<TouchableOpacity style={styles.item} onPress={goDataView}>
      <Flex direction="row"   >
          <Icon as={MaterialCommunityIcons} name="security" style={styles.iconOptions} />   
          <Center size={3}></Center>
          <Text style={styles.text}>Ver Data</Text>
        </Flex>
</TouchableOpacity>*/}

      {/* <TouchableOpacity
        style={[styles.item, styles.itemClose]}
        onPress={logout}
      >
        <Text style={styles.textClose}>Cerrar sesión</Text>
      </TouchableOpacity> */}





            <AlertDialog  isOpen={isOpen} onClose={onClose}>
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Datos</AlertDialog.Header>
                <AlertDialog.Body>
                
                <TextArea h={500} placeholder="Text Area Placeholder" w="100%" maxW="300">
                  {datos}
                </TextArea>

                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} >
                      Cancelar
                    </Button>
                   
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>


    </View>
  );
}