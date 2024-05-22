import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Pressable, } from "react-native";
import { IconButton, ChevronLeftIcon, Avatar,Icon,useToast, Box } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Group,User,Auth,GroupMessage } from "../../../api";
import { useAuth } from "../../../hooks";
import { ENV, screens,MD5method } from "../../../utils";
import { styles } from "./HeaderGroup.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal,FormControl,Input,Button } from "native-base";
import { EventRegister } from "react-native-event-listeners"; 

const userController = new User();
const groupController = new Group();
const authController = new Auth();
const groupMessageController = new GroupMessage();

export function HeaderGroup(props) {


  const { groupId } = props;
  const navigation = useNavigation();
  const { accessToken } = useAuth();
  const [group, setGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [nip, setNip] = useState('');
  const [tituloModal, setTituloModal] = useState('Mensajes bloqueados por NIP');
  const [lock, setLock] = useState(true);

  const toast = useToast();


  useEffect(() => {

    (async () => {
       const cifrado = await authController.getCifrado();
       if(cifrado=="SI"){
        setLock(true);
       }else{
        setLock(false);
       }
     })();




    (async () => {
      try {
        const response = await groupController.obtain(accessToken, groupId);
        setGroup(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [groupId]);

  const goToGroupProfile = () => {
  
    navigation.navigate(screens.global.groupProfileScreen, {
      groupId,
    });
  };

  const updateMessagesInDB = async () => {
  

    return navigation.goBack();
  };

  const validateNIP = async () => {
    console.log("======validating NIP==================");
    
    //call api to validate nip 
    const response = await userController.getMe(accessToken);
    //console.log("nip en DB");
    //console.log(response.nip);
    //console.log("nip ingresado");
    //console.log(nip);
    //console.log("nip ingresado MD5");
   // console.log(MD5method(nip.toString() ));

    if(MD5method(nip.toString()) == response.nip){
      console.log("NIP OK");
      //if, it is ok, unlock messages, reloading them
      await authController.setCifrado("NO");
      EventRegister.emit("setCifrado","NO");
      setLock(false);
     
      setShowModal(false);

    }else{
      //else, show an error message
      await authController.setCifrado("SI");
      EventRegister.emit("setCifrado","SI");
      setLock(true);
      
      setTituloModal("NIP Incorrecto!");
      console.log("NIP Incorrecto");

      toast.show({
        placement: "top",
        render: () => {
          return <Box bg="#0891b2" px="4" py="3" rounded="md" mb={8} style={{borderTopColor:'white', borderTopWidth:3,color:'white', zIndex:3000 }}>
                <Text style={{color:'white'}}>NIP incorrecto!</Text>
                 
                </Box>;
        }
      }); 
    }
   
    
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>

       {/*icono del lado izquierdo */}
        <View style={styles.info}>
        {/*icono Back */}
          <IconButton
            icon={<ChevronLeftIcon />}
            padding={0}
            onPress={updateMessagesInDB}
          />

         {/*logo group Back */}
          {group && (
            <Pressable onPress={goToGroupProfile} style={styles.info}>
              <Avatar
                bg="cyan.500"
                marginRight={3}
                size="sm"
                style={styles.avatar}
                source={{ uri: `${ENV.BASE_PATH}/group/group1.png` }}
              />
               {/*Nombre grupo */}
              <Text style={styles.name}>{group.name.substring(0,20) }</Text>
            </Pressable>
          )}
        </View>


        {/*  candadito verde para bloquear y desbloquear  */}
        <IconButton
            icon={<Icon as={MaterialCommunityIcons} name={lock ? "lock" : "lock-open-variant"} style={styles.iconLocked} /> }
            onPress={() => {

              if(lock ==false){
                   //just change icon status
                setLock(true);         
                //emit evento para unlockMessages
                EventRegister.emit("setCifrado","SI");
              
              }else{
                
                setTituloModal('Mensajes bloqueados por NIP');
                setShowModal(true);
              }
              
            }}
          />


      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />

          <Modal.Header>{tituloModal}</Modal.Header>

          <Modal.Body>
            <FormControl>
             
              <Input w={{base: "100%", md: "25%"}} type={showPwd ? "text" : "password"}
               onChangeText={(text) => setNip(text)}
              InputRightElement={<Pressable onPress={() => setShowPwd(!showPwd)}>
                                    <Icon as={<Icon as={MaterialCommunityIcons} name={showPwd ? "eye" : "eye-off"} style={styles.iconPwdNip} /> } size={8} mr="8" color="muted.400" />
                                </Pressable>} placeholder="Su NIP" />

            </FormControl>
          </Modal.Body>

          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                
              setShowModal(false);
            }}>
                Cancelar
              </Button>
              <Button               
              onPress={() => {
                validateNIP();
            }}>
                Desbloquear
              </Button>
            </Button.Group>
          </Modal.Footer>


        </Modal.Content>
      </Modal>

      </View>
    </SafeAreaView>
  );
}