import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Pressable, } from "react-native";
import { IconButton, ChevronLeftIcon, Avatar,Icon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Group } from "../../../api";
import { useAuth } from "../../../hooks";
import { ENV, screens } from "../../../utils";
import { styles } from "./HeaderGroup.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal,FormControl,Input,Button } from "native-base";


const groupController = new Group();

export function HeaderGroup(props) {

  const { groupId } = props;
  const navigation = useNavigation();
  const { accessToken } = useAuth();
  const [group, setGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.info}>
          <IconButton
            icon={<ChevronLeftIcon />}
            padding={0}
            onPress={navigation.goBack}
          />

          {group && (
            <Pressable onPress={goToGroupProfile} style={styles.info}>
              <Avatar
                bg="cyan.500"
                marginRight={3}
                size="sm"
                style={styles.avatar}
                source={{ uri: `${ENV.BASE_PATH}/${group.image}` }}
              />
              <Text style={styles.name}>{group.name.substring(0,20) }</Text>
            </Pressable>
          )}
        </View>

        <IconButton
            icon={<Icon as={MaterialCommunityIcons} name="lock-open-variant" style={styles.iconLocked} /> }
            onPress={() => setShowModal(true)}
          />


<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />

          <Modal.Header>Mensjaes bloqueados por NIP</Modal.Header>

          <Modal.Body>
            <FormControl>
             
            
            
              <Input w={{base: "100%", md: "25%"}} type={showPwd ? "text" : "password"}
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
              <Button onPress={() => {
              setShowModal(false);
            }}>
                Entrar
              </Button>
            </Button.Group>
          </Modal.Footer>


        </Modal.Content>
      </Modal>





      </View>
    </SafeAreaView>
  );
}
