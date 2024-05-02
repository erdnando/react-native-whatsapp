import { useState, useEffect, useCallback } from "react";
import { View, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { IconButton, AddIcon } from "native-base";
import { size } from "lodash";
import { Group,Auth,User, GroupMessage } from "../../api";
import { useAuth } from "../../hooks";
import { screens,MD5method } from "../../utils";
import { LoadingScreen } from "../../components/Shared";
import { ListGroups, Search } from "../../components/Group";
import { EventRegister } from "react-native-event-listeners"; 
import { Modal,FormControl,Button } from "native-base";
import * as statex$ from '../../state/local'

const groupController = new Group();
const authController = new Auth();
const userController = new User();

const groupMessageController = new GroupMessage();


export function GroupsScreen() {
  
  //const { createTableBitacora, selectTableBitacora } = useDB();
  const navigation = useNavigation();
  const { accessToken,updateUser,email } = useAuth();
  const [groups, setGroups] = useState(null);
  const [groupsResult, setGroupsResult] = useState(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [nip, setNip] = useState("00000000");

  useEffect(() => {
  
    async function validateInitialModal() {

      const firtsTime=  await authController.getInitial();
      console.log("Groups screens");
      console.log("firtsTime");
      console.log(firtsTime);

      if(firtsTime=="1"){ 
        setShowModal(true);
      }
    }
    validateInitialModal();
   
}, []);


  useEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={<AddIcon />}
          padding={0}
          onPress={() =>{
              navigation.navigate(screens.tab.groups.createGroupScreen)
          } 
          }
        />
      ),
    });

  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let resultx={} 
         //================Get all grupos===================================
        try {
        
            const groupsRef = await groupController.getAllGroupsDB(email);

            //const result = response?.sort((a, b) => {
            //  return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
            //});
            //resultx=result;

            setGroups(groupsRef);
            setGroupsResult(groupsRef);

          //==================get all messages===================================
          try {

            //En linea va guardando la ultima foto de datos
            if(statex$.default.flags.offline.get()=='false'){

                  console.log("Gathering all data into state en groupScreen")
                  //to gather all groups with their messages into state
                  statex$.default.groupmessages.set([]);//clean
                  const arrMessageGrupo = statex$.default.groupmessages.get();//get clean list

                  //Por cada grupo
                  resultx.forEach( async (gpo) => { 
                    console.log("gpo-------------->");
                    console.log(gpo._id);

                    const gpoMessages = await groupMessageController.getAll(accessToken, gpo._id);

                    console.log("gpoMessages get all del grupo-->")
                    console.log(gpoMessages)
                    
                    gpoMessages.messages.forEach( (msgx)=>{
                      console.log("msgx detetctado:::::::::::")
                      console.log(msgx)
                      statex$.default.groupmessages.set((arrMessageGrupo) => [...arrMessageGrupo, msgx])
                    });



                    console.log("Mensajes recuperados!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
                    console.log(statex$.default.groupmessages.get())
  
                    const arrUsers = await userController.getAllUsers(accessToken);
                    statex$.default.user.set(arrUsers);
  
                    console.log("User recuperados!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
                    console.log(statex$.default.user.get())


                  });

                 
              }
          } catch (error) {
            console.error(error);
          }
        //======================================================================

        } catch (error) {
          console.error(error);
        }

        

      })();
    }, [])
  );

 

  const upGroupChat = (groupId) => {

      if(statex$.default.flags.offline.get()=='true'){
          //setGroupsResult(statex$.default.getAll.get())

         // console.log("recuperando groupsResult")
          //console.log( groupsResult)
      }

  
      const data = groupsResult;
      const fromIndex = data.map((group) => group._id).indexOf(groupId);
      const toIndex = 0;
      const element = data.splice(fromIndex, 1)[0];
    
      data.splice(toIndex, 0, element);
      setGroups([...data]);
   
  };


 // if(statex$.default.flags.offline.get()=='true'){
    //setGroupsResult(statex$.default.getAll.get())
  //}
  console.log("setGroupsResult::::::::::::::::::::::::::::::::::::::::")
  //console.log(groupsResult)
  //console.log(statex$.default.getAll.get())
  console.log("::::::::::::::::::::::::::::::::;;;;;;;;;;;;;;;;::::::::")

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