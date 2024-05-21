import { useEffect,useState } from "react";
import { View, Text } from "react-native";
import { Avatar, Input, Icon, IconButton, CheckIcon,Checkbox } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { Group } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { imageExpoFormat, ENV } from "../../../../utils";
import { initialValues,validationSchemaLlave, validationSchema } from "./Form.form";
import { styles } from "./Form.styles";

const groupController = new Group();

export function Form(props) {

  const { usersId } = props;
  const navigation = useNavigation();
  const { accessToken, user } = useAuth();

  const [isChecked, setIschecked] = useState(false);


  const formik = useFormik({
    
    initialValues: initialValues() ,
    validationSchema: !isChecked ? validationSchema(): validationSchemaLlave(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const { name, image, llave } = formValue;
        
        await groupController.create(
          accessToken,
          user._id,
          usersId,
          name,
          image,
          llave
        );

        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton style={{margin:10,marginRight:10}}
          icon={<CheckIcon size="lg" />}
          padding={0}
          onPress={formik.handleSubmit}
        />
      ),
    });
  }, []);

 const handleTipoGrupoChange = ()=>{
  setIschecked(!isChecked)

  if(!isChecked){
    formik.values.llave=""
  }
 console.log("formik.values.llave")
 console.log(formik.values.llave)
 
 }

  const openGallery = async () => {
    const result = await ImagePicker.launchCameraAsync({  //launchImageLibraryAsync
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const file = imageExpoFormat(result.assets[0].uri);
      formik.setFieldValue("image", file);
    }
  };

  return (
    <View style={styles.content}>
      {/*<Pressable onPress={openGallery}>*/}
        <Avatar
          bg="cyan.500"
          size="xl"
          source={{ uri: `${ENV.BASE_PATH}/group/group1.png` }}
          style={[styles.image, formik.errors.image && styles.imageError]}
        >
          <Icon
            as={MaterialCommunityIcons}
            size="9"
            name="camera"
            color="primary.50"
          />
        </Avatar>
      {/*</Pressable>*/}

      <Input
        placeholder="Nombre del grupo"
        maxLength={30}
        variant="unstyled"
        value={formik.values.name}
        onChangeText={(text) => formik.setFieldValue("name", text)}
        style={[styles.input, formik.errors.name && styles.inputError]}
      />
 

    {/*checkbox grupo uno a uno*/}
      <View style={{width:'100%', marginTop:10, marginBottom:10}}>

        <Checkbox shadow={2} size="lg" style={{}}  isChecked={isChecked}  onChange={() => handleTipoGrupoChange()} value={isChecked} aria-label={"xxxxxx"}
        icon={<Icon style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]  }} as={<MaterialCommunityIcons name="key" />}  />}    >

          <Text style={{color:'white'}}>Grupo uno a uno</Text>

        </Checkbox>
      </View>

      <Input display = {!isChecked ? "none":"flex"}
        maxLength={150}
        placeholder="Llave de cifrado exclusiva del grupo"
        variant="unstyled"
        value={formik.values.llave}
        multiline={true}
        onChangeText={(text) => formik.setFieldValue("llave", text)}
        style={[styles.input, formik.errors.llave && styles.inputError]}
      />


    </View>
  );
}