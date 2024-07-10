import { useState, useEffect, useCallback } from "react";
import { View, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { IconButton, AddIcon } from "native-base";
import { size } from "lodash";
import { Group,Auth,User } from "../../api";
import { useAuth } from "../../hooks";
import { screens,MD5method } from "../../utils";
import { LoadingScreen } from "../../components/Shared";
import { ListGroups, Search } from "../../components/Group";
import { Modal,FormControl,Button } from "native-base";
import * as statex$ from '../../state/local'
import { UPDATE_STATE_ALLGROUPS, GET_STATE_ALLGROUPS,GET_STATE_GROUP_READ_MESSAGE_COUNT_ALL } from '../../hooks/useDA';
import { EventRegister } from "react-native-event-listeners";


const groupController = new Group();
const authController = new Auth();
const userController = new User();

export function GroupsScreen() {
  
  const navigation = useNavigation();
  const { accessToken,updateUser } = useAuth();
  const [groups, setGroups] = useState(null);
  const [groupsResult, setGroupsResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [arrContadores, setArrContadores] = useState(null);
  const [nip, setNip] = useState("00000000");



  //=====================LISTENERS============================================================================

  //updatingContadores
  useEffect(() => {
  
       const eventContadores = EventRegister.addEventListener("updatingContadores", async bFlag=> {
         
              try {
      
                await GET_STATE_GROUP_READ_MESSAGE_COUNT_ALL().then(result =>{
                  resAux=result.rows._array;
               
                  if(resAux.length >0){
                    setArrContadores(resAux)
                  }
                }); 
                
              } catch (error) {
                console.error(error);
              }
        });
    
        return ()=>{
          EventRegister.removeEventListener(eventContadores);
        }
  }, []);


//=====================ON_LOAD============================================================================

  //Valida 1a vez y presenta NIP inicial
  useEffect(() => {
      
      if(!statex$.default.isConnected.get()){
        Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',      } ]);
      }
      
      async function validateInitialModal() {

        const firtsTime=  await authController.getInitial();

        if(firtsTime=="1"){
        
          const min = 1000; 
          const max = 9999; 
          const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min; 
         
          setNip("2"+randomNumber);
        const cifrado =MD5method("2"+randomNumber).toString();

          await userController.updateUser(accessToken, { nip: cifrado });
          //hash nip
          updateUser("nip", cifrado);
          setShowModal(true);
        }
      }
      validateInitialModal();
  }, []);

  //Valida Offline
  useEffect(() => {

      if(statex$.default.isConnected.get()){
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon={<AddIcon />}
              padding={0}
              onPress={() => {
              navigation.navigate(screens.tab.groups.createGroupScreen) 
            }}
            />
          ),
        });
      }else{
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon={<AddIcon />}
              padding={0}
              onPress={() => {
                Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',      } ]);
              }}
            />
          ),
        });
      }
      

  }, []);

  //Carga todos los grupos
  useFocusEffect(
      useCallback(() => {
        (async () => {

          let response = null;

          try {

            //Get all GRUPOS!!!!
            if(statex$.default.isConnected.get()){

              response = await groupController.getAll(accessToken);
                UPDATE_STATE_ALLGROUPS(JSON.stringify(response));
            }else{
                await GET_STATE_ALLGROUPS().then(result =>{
                response=result.rows._array;
                response =JSON.parse(response[0].valor);
                });
            }

            const result = response.sort((a, b) => {
              return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
            });

            setGroups(result);
            setGroupsResult(result);

          } catch (error) {
            console.error(error);
          }
        })();
      }, [])
  );

  //=====================FUNCIONES============================================================================
  const upAllGroups=async ()=>{

      let response = null;

      try {

        //Get all GRUPOS!!!!
        if(statex$.default.isConnected.get()){

          response = await groupController.getAll(accessToken);
            UPDATE_STATE_ALLGROUPS(JSON.stringify(response));
        }else{
            await GET_STATE_ALLGROUPS().then(result =>{
            response=result.rows._array;
            response =JSON.parse(response[0].valor);
            });
        }

        const result = response.sort((a, b) => {
          return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
        });

        setGroups(result);
        setGroupsResult(result);


        const d = new Date();
        let ms = d.getMilliseconds();
        statex$.default.lastBannedRequest.set(ms)
        statex$.default.lastGroupInvitation.set(ms)

      } catch (error) {
        console.error(error);
      }

      
  }
   
  const upGroupChat = (groupId) => {

      const data = groupsResult;
      const fromIndex = data.map((group) => group._id).indexOf(groupId);
      const toIndex = 0;
      const element = data.splice(fromIndex, 1)[0];
    
      data.splice(toIndex, 0, element);
      setGroups([...data]);
  };


    //=====================VIEW============================================================================
  if (!groupsResult) return <LoadingScreen />;

  return (
    <View>
      {size(groups) > 0 && <Search data={groups} setData={setGroupsResult} />}
      <ListGroups groups={size(groups) === size(groupsResult) ? groups : groupsResult}
                  upGroupChat={upGroupChat} upAllGroups={upAllGroups} contador= {arrContadores}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />

          <Modal.Header>NIP</Modal.Header>

          <Modal.Body>
          Conserve su NIP para acceder a sus mensajes
            <FormControl>
            <Modal.Header  alignItems={"center"} width={"100%"}  >{nip}</Modal.Header>
            
            </FormControl>
            Recuerde que puede modificar su NIP, Alias de participante y foto en el apartado de ajustes en cualquier momento.
          </Modal.Body>

          <Modal.Footer>
            <Button.Group space={2}>
            
              <Button               
              onPress={() => {
                setShowModal(false);
            }}>
                Aceptar
              </Button>
            </Button.Group>
          </Modal.Footer>


        </Modal.Content>
      </Modal>
    </View>
  );
}