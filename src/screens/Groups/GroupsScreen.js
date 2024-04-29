import { useState, useEffect, useCallback } from "react";
import { View, Text } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { IconButton, AddIcon } from "native-base";
import { size } from "lodash";
import { Group,Auth,User } from "../../api";
import { useAuth,useDB } from "../../hooks";
import { screens,MD5method } from "../../utils";
import { LoadingScreen } from "../../components/Shared";
import { ListGroups, Search } from "../../components/Group";
import { EventRegister } from "react-native-event-listeners"; 
import { Modal,FormControl,Button } from "native-base";

const groupController = new Group();
const authController = new Auth();
const userController = new User();

export function GroupsScreen() {
  
  //const { opendb,createTableBitacora, selectTableBitacora } = useDB();
  const navigation = useNavigation();
  const { accessToken,updateUser,idAPPEmail } = useAuth();
  const [groups, setGroups] = useState(null);
  const [groupsResult, setGroupsResult] = useState(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [nip, setNip] = useState("00000000");

  useEffect(() => {
  

   // const db = opendb();
   // console.log("db status::::")
   // console.log(db)

    async function validateInitialModal() {

      const firtsTime=  await authController.getInitial();

      if(firtsTime=="1"){
        /*console.log("NIP modal");


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
        updateUser("nip", cifrado);*/

        const userRegistrado =  authController.loginLocal(idAPPEmail );
        //console.log("userRegistrado nip:::::");
        //console.log(userRegistrado[0]);
        setNip(userRegistrado[0].nip);


        setShowModal(true);
        

       
      }
    }
    validateInitialModal();
   


}, []);


  useEffect(() => {

    async function fetchData() {
     // deleteTable('USERS');
     //createTableBitacora('BITACORA');//initialize table
     //addUser('erdnando@gmail.com');
     //selectTableBitacora();
    }
    fetchData();

    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={<AddIcon />}
          padding={0}
          onPress={() =>
            navigation.navigate(screens.tab.groups.createGroupScreen)
          }
        />
      ),
    });

  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          //Get all messages
          //const responsex = await groupController.getAll(accessToken);
          const response = groupController.getAllLocal(idAPPEmail);

          const result = response.sort((a, b) => {
            return ( new Date(b.last_message_date) - new Date(a.last_message_date)  );
          });

          setGroups(result);
          setGroupsResult(result);
          //console.log("getAllLocal:::::::::::::::::::::::::::::::::::::::::::")
          //console.log(result)

        } catch (error) {
          console.error(error);
        }
      })();
    }, [])
  );

 

  const upGroupChat = (groupId) => {

    console.log("in upGroupChat")
    console.log(groupId)
    console.log(groupsResult)

    const data = groupsResult;
    const fromIndex = data.map((group) => group._id).indexOf(groupId);
    const toIndex = 0;
    const element = data.splice(fromIndex, 1)[0];
   
    data.splice(toIndex, 0, element);

    console.group(data)
    console.group("=============data groups======")
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
