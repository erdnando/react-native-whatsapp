import { View, Text,Pressable, } from "react-native";
import { Menu,Icon,AlertDialog,Button } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect,useRef } from "react";
import { DateTime } from "luxon";
import { useAuth } from "../../../../hooks";
import { styled } from "./ItemText.styles";
import { Auth } from '../../../../api';
import { EventRegister } from "react-native-event-listeners";



const authController = new Auth();

export function ItemText(props) {

  const { message } = props;
  const { user } = useAuth();
  const isMe = user._id === message.user._id;
  const styles = styled(isMe);
  const createMessage = new Date(message.createdAt);

  const [modoAvanzado, setmodoAvanzado] = useState(false);
  const [showAdvertencia, setShowAdvertencia] = useState(false);
  const [mensajeEliminar, setMensajeEliminar] = useState(null);


  const onCloseAdvertencia = () => setShowAdvertencia(false);
 
  const onEliminarMensaje = () => {


    setShowAdvertencia(false);
    console.log("eliminando message:::::::::::");
                         
    //delete
    //persist changes
    //reoad mesages
    EventRegister.emit("deletingMessage",mensajeEliminar);  //
    setMensajeEliminar(null);
  }

  //Identifica modo avanzado basado en el estatus de cifrado
  useEffect( () => {

    async function fetchData() {
     // console.log("useEffect ItemText:::::");
      const cifrado = await authController.getCifrado();
      //console.log("cifrado item:::::"+cifrado);
      if(cifrado=="SI"){
       setmodoAvanzado(false);
      }else{
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
                    : message.user.email.substring(0,30) }
                </Text>

                <Menu w="190" trigger={triggerProps => {
                  return <Pressable style={styles.menu}  accessibilityLabel="More options menu" {...triggerProps}>
                          <Icon
                            as={MaterialCommunityIcons}
                            size="7"
                            name="arrow-down-drop-circle"
                            color="black"
                          />
                        </Pressable>;
                }}>
                    <Menu.Item  
                        onPress={() => {
                     
                           console.log("editando message:::::::::::");
                         
                           //set message on the input
                           //persist changes
                           //reoad mesages
                           EventRegister.emit("editingMessage",message);  //-->GroupForm
                        }}>
                    Editar</Menu.Item>
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
             
              {/*Mensaje*/}
              <Text style={styles.text}>{message.message}</Text>
              {/*cifrado*/}
              <Text style={styles.cifrado}>{message.tipo_cifrado}</Text>
              {/*hora del mensaje*/}
              <Text style={styles.date}>
                {DateTime.fromISO(createMessage.toISOString()).toFormat("HH:mm")}
              </Text>
              
            </View>

            <AlertDialog  isOpen={showAdvertencia} onClose={onCloseAdvertencia}>
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Eliminar mensaje</AlertDialog.Header>
                <AlertDialog.Body>
                  Esta apunto de eliminar el mensaje: {message.message}
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button variant="unstyled" colorScheme="coolGray" onPress={onCloseAdvertencia} >
                      Cancelar
                    </Button>
                    <Button colorScheme="danger" onPress={onEliminarMensaje}>
                      Eliminar mensaje
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>

          </View>
        );
      }
  else{
      return (
        <View style={styles.content}>
          <View style={styles.message}>
            
        
            <Text style={styles.identity}>
              {message.user.firstname || message.user.lastname
                ? `${message.user.firstname || ""} ${message.user.lastname || ""}`
                : message.user.email.substring(0,30)}
            </Text>
            <Text style={styles.text}>{message.message}</Text>
            <Text style={styles.cifrado}>{message.tipo_cifrado}</Text>
            <Text style={styles.date}>
              {DateTime.fromISO(createMessage.toISOString()).toFormat("HH:mm")}
            </Text>
          </View>
        </View>
      );
    }
}



{/*
{!isMe && (
  <Text style={styles.identity}>
    {message.user.firstname || message.user.lastname
      ? `${message.user.firstname || ""} ${message.user.lastname || ""}`
      : message.user.email}
  </Text>
)}
*/}