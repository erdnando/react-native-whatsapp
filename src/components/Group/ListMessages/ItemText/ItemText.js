import { View, Text,Pressable,Clipboard } from "react-native";
import { Menu,Icon,AlertDialog,Button } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect,useRef } from "react";
import { DateTime } from "luxon";
import { useAuth } from "../../../../hooks";
import { styled } from "./ItemText.styles";
import { Auth } from '../../../../api';
import { EventRegister } from "react-native-event-listeners";
import { Decrypt,Encrypt } from "../../../../utils";



const authController = new Auth();

export function ItemText(props) {

  const { message } = props;
  const { user } = useAuth();
  const isMe = user._id === message.user._id;
  const styles = styled(isMe);
  const createMessage = new Date(message.createdAt);
  const updatedMessage = new Date(message.updatedAt);

  const [modoAvanzado, setmodoAvanzado] = useState(false);
  const [showAdvertencia, setShowAdvertencia] = useState(false);
  const [mensajeEliminar, setMensajeEliminar] = useState(null);
  const [editado, setEditado] = useState(false);
  const [replicado, setReplicado] = useState(false);

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

    if(message.email_replied != null){
      console.log("si hay mensaje replicado!!!")
      setReplicado(true);

      console.log(message.email_replied)
      console.log(message.tipo_cifrado_replied)
      console.log(message.message_replied)
      console.log(":::::::::::::::::::::::::::::::::::;:::::::::::");
    }else{
      console.log("no hay mensaje replicado!!")
      setReplicado(false);
    }
  
    if(createMessage.getTime() ==updatedMessage.getTime() ){
       setEditado(false)
    }else{
      setEditado(true)
    }

    async function fetchData() {
     // console.log("useEffect ItemText:::::");
      const cifrado = await authController.getCifrado();
     // console.log("cifrado item:::::"+cifrado);
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

             {/*Textos del encabezado*/}
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
                           EventRegister.emit("editingMessage",message);  //-->GroupForm
                        }}>
                    Editar</Menu.Item>
                    <Menu.Item  
                        onPress={() => {
                     
                           console.log("responder message:::::::::::");
                           EventRegister.emit("replyingMessage",message);  //-->GroupForm
                        }}>
                    Responder</Menu.Item>
                    <Menu.Item  
                        onPress={() => {
                     
                           console.log("copiando message:::::::::::");
                         
                           //set text message on the clipboard
                           Clipboard.setString(message.message);
                        }}>
                    Copiar</Menu.Item>
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




              {/*Vista del mensaje replicado*/}
              <View display={replicado?"flex":"none"} style={{backgroundColor:'#b5e0f6', marginLeft:2,marginRight:40,marginTop:5,marginBottom:8,padding:8,borderRadius:8, borderLeftColor:'black',borderLeftWidth:3}}>
                 {/*alias replicado*/}
                 <Text style={styles.identityReplica}>
                  {message.email_replied }
                </Text>
                

                 {/*mensaje replicado*/}
                 <Text style={styles.identityMsgReplica}>
                  {message.message_replied }
                </Text>

              </View>




             
              {/*Mensaje*/}
              <Text style={styles.text}>{message.message}</Text>
              {/*cifrado*/}
              <Text style={styles.cifrado}>{message.tipo_cifrado}</Text>
              {/*hora del mensaje*/}
              <Text style={styles.date}>
                {DateTime.fromISO(createMessage.toISOString()).toFormat("HH:mm")}
              </Text>
               {/*hora del mensaje editado*/}
               <View display={editado?"flex":"none"}>
               <Text  style={styles.dateEditado}  >
                {"Editado: " + DateTime.fromISO(updatedMessage.toISOString()).toFormat("HH:mm")}
              </Text>
              </View>
              
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