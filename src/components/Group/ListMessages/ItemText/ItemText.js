import { View, Text,Pressable,Clipboard } from "react-native";
import { Menu,Icon,AlertDialog,Button } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect,useRef } from "react";
import { DateTime } from "luxon";
import { useAuth } from "../../../../hooks";
import { styled } from "./ItemText.styles";
import { Auth } from '../../../../api';
import { EventRegister } from "react-native-event-listeners";
import * as statex$ from '../../../../state/local.js'


const authController = new Auth();

export function ItemText(props) {

  const { message } = props;
  const { user,idAPPEmail } = useAuth();
  //const isMe = user._id === message?.user._id;
  const isMe = idAPPEmail=== message?.user.email;
  const styles = styled(isMe);
  const createMessage = new Date(message.createdAt);
  const updatedMessage = new Date(message.updatedAt);

  const [modoAvanzado, setmodoAvanzado] = useState(false);
  const [showAdvertencia, setShowAdvertencia] = useState(false);
  const [mensajeEliminar, setMensajeEliminar] = useState(null);
  const [editado, setEditado] = useState(false);
  const [replicado, setReplicado] = useState(false);
  const [forwarded, setForwarded] = useState(false);

  const onCloseAdvertencia = () => setShowAdvertencia(false);
 
  const onEliminarMensaje = () => {

    setShowAdvertencia(false);
    //console.log("eliminando message:::::::::::");
                         
    EventRegister.emit("deletingMessage",mensajeEliminar);  //
    setMensajeEliminar(null);
  }

  //Identifica modo avanzado basado en el estatus de cifrado
  useEffect( () => {

    //console.log("message itemText:::::::::::::::::::::::::::::::::::::::")
    //console.log(message)
    setForwarded(message.forwarded);
    

    if(message.email_replied != null){
     // console.log("si hay mensaje replicado!!!")
      setReplicado(true);

      //console.log(message.email_replied)
      //console.log(message.tipo_cifrado_replied)
      //console.log(message.message_replied)
      //console.log(":::::::::::::::::::::::::::::::::::;:::::::::::");
    }else{
     // console.log("no hay mensaje replicado!!")
      setReplicado(false);
    }
  
    if(createMessage.getTime() ==updatedMessage.getTime() ){
       setEditado(false)
    }else{
      setEditado(true)
    }

    async function fetchData() {
     // console.log("useEffect ItemText:::::");
      //const cifrado = await authController.getCifrado();
      const cifrado = statex$.default.flags.cifrado.get();
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

                <Menu w="180" trigger={triggerProps => {
                  return <Pressable style={styles.menu}  accessibilityLabel="More options menu" {...triggerProps}>
                          <Icon
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
                            style={{}}
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
                     
                           //console.log("reenviando message:::::::::::");
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
                    {/*copiar*/}
                    <Menu.Item  style={styles.menuItem}  
                        onPress={() => {
                     
                           //console.log("copiando message:::::::::::");
                         
                           //set text message on the clipboard
                           Clipboard.setString(message.message);
                        }}>
                    <View style={styles.contentMenuItem} >
                            <Text>Copiar</Text>
                            <Icon
                            style={{}}
                            as={MaterialCommunityIcons}
                            size="7"
                            name="content-copy"
                            color="black"
                          />
                          </View>
                    </Menu.Item>
                   {/*editar*/}
                    <Menu.Item display={isMe?'flex':'none'} style={styles.menuItem}  
                        onPress={() => {
                     
                           //console.log("editando message:::::::::::");
                           EventRegister.emit("editingMessage",message);  //-->GroupForm
                        }}>
                    <View style={styles.contentMenuItem} >
                            <Text>Editar</Text>
                            <Icon
                            style={{}}
                            as={MaterialCommunityIcons}
                            size="7"
                            name="tooltip-edit-outline"
                            color="black"
                          />
                          </View>
                    </Menu.Item>
                   {/*eliminar*/}
                    <Menu.Item display={isMe?'flex':'none'}    
                        onPress={() => {
                          setMensajeEliminar(message);
                          setShowAdvertencia(true);
                          //reoad mesages
                            //
                        }}>
                    <View style={styles.contentMenuItem} >
                            <Text>Eliminar</Text>
                            <Icon
                            style={{}}
                            as={MaterialCommunityIcons}
                            size="7"
                            name="delete"
                            color="red"
                          />
                          </View>
                    </Menu.Item>

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