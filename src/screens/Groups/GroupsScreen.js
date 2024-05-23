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
import { UPDATE_STATE_ALLGROUPS, GET_STATE_ALLGROUPS } from '../../hooks/useDA';



const groupController = new Group();
const authController = new Auth();
const userController = new User();

export function GroupsScreen() {
  
  const navigation = useNavigation();
  const { accessToken,updateUser } = useAuth();
  const [groups, setGroups] = useState(null);
  const [groupsResult, setGroupsResult] = useState(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [nip, setNip] = useState("00000000");


 

    useEffect(() => {

      console.log("statex$.default.isConnected.get()")
      console.log(statex$.default.isConnected.get())

      
      if(!statex$.default.isConnected.get()){
        Alert.alert ('Modo offline. ','La aplicacion pasa a modo offline, por lo que no podra generar nuevos mensajes u operaciones',
        [{  text: 'Ok',      } ]);
      }
      
    
      async function validateInitialModal() {

        const firtsTime=  await authController.getInitial();

        if(firtsTime=="1"){
          console.log("NIP modal");


          const min = 1000; 
          const max = 9999; 
          const randomNumber =  Math.floor(Math.random() * (max - min + 1)) + min; 

          console.log("set nip:::::");
          console.log(randomNumber);
          console.log("accessToken:::::"+accessToken);

          console.log("setShowModal:::::");
          setNip("A"+randomNumber);
        const cifrado =MD5method("A"+randomNumber).toString();

          await userController.updateUser(accessToken, { nip: cifrado });
          //hash nip
          updateUser("nip", cifrado);
          setShowModal(true);
          

        
        }
      }
      validateInitialModal();
    


  }, []);


    useEffect(() => {

      async function fetchData() {
    
      }
      fetchData();

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

    useFocusEffect(
      useCallback(() => {
        (async () => {

          let response = null;

          try {

            //Get all GRUPOS!!!!
            if(statex$.default.isConnected.get()){

              response = await groupController.getAll(accessToken);

                console.log("Persistiendo ADD_STATE_ALLGROUPS")
                //console.log(response)
                console.log(JSON.stringify(response))
                UPDATE_STATE_ALLGROUPS(JSON.stringify(response));

                //==============================================
                
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

   
    const upGroupChat = (groupId) => {

      const data = groupsResult;
      const fromIndex = data.map((group) => group._id).indexOf(groupId);
      const toIndex = 0;
      const element = data.splice(fromIndex, 1)[0];
    
      data.splice(toIndex, 0, element);
      setGroups([...data]);
    

    };

    if (!groupsResult) return <LoadingScreen />;

  return (
    <View>
      {size(groups) > 0 && <Search data={groups} setData={setGroupsResult} />}
      <ListGroups groups={size(groups) === size(groupsResult) ? groups : groupsResult}
                  upGroupChat={upGroupChat}
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
            Recuerde que puede modificar su NIP en el apartado de ajustes en cualquier momento.
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