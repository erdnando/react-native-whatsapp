import { useEffect,useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Avatar, Input, Icon, IconButton, CheckIcon,Checkbox,Spinner, Heading, Box, useToast  } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { Group } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { imageExpoFormat, ENV } from "../../../../utils";
import { initialValues,validationSchemaLlave, validationSchema } from "./Form.form";
import { styles } from "./Form.styles";
import { ADD_STATE_GROUP_LLAVE } from '../../../../hooks/useDA'
import { EventRegister } from "react-native-event-listeners";

const groupController = new Group();

export function Form(props) {

  const { usersId } = props;
  const navigation = useNavigation();
  const { accessToken, user } = useAuth();
  const toast = useToast();

  const [isChecked, setIschecked] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({

    initialValues: initialValues() ,
    validationSchema: !isChecked ? validationSchema(): validationSchemaLlave(),
    validateOnChange: false,
    onSubmit: async (formValue) => {

     // console.log("Creando canal......")
      setIsLoading(true);


      //TODO: validat eif this channel exists previously
      const aliasResponse = await groupController.validateAlias(accessToken, formValue.name);
      console.log(aliasResponse)
      if(aliasResponse.length>0){
        //==================================================================================================================
           // console.log("El alias ya existe, favor de utilizar otro....")
            setIsLoading(false);
            toast.show({
              placement: "top",
              render: () => {
                return <Box bg="#ff5733" px="4" py="3" rounded="md" mb={8} style={{borderTopColor:'white', borderTopWidth:3,color:'white', zIndex:3000 }}>
                      <Text style={{color:'white'}}>Lo sentimos, este nombre de canal ya ha sido utilizado. favor de utilizar otro 😓 </Text>
                      </Box>;
              }
            });
        //==================================================================================================================
      }else{

              try {
                const { name, image, llave } = formValue;
                
                const grupoCreado =await groupController.create(
                  accessToken,
                  user._id,
                  usersId,
                  name,
                  image,
                  llave
                );

                //=====persist llave-group relation when a private group is created
              
              //TODO add creation date and type fields and reply with open groups, not just closed ones
              const fechaAlta = new Date().toISOString();
              ADD_STATE_GROUP_LLAVE(grupoCreado._id, llave,"cerrado",fechaAlta);//abierto

              setIsLoading(false);
                navigation.goBack();
              } catch (error) {
                setIsLoading(false);
                console.error(error);
              }

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
     // console.log("formik.values.llave")
     // console.log(formik.values.llave)
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


  const onTextChanged = (value) => {
    //code to remove non-numeric characters from text
    formik.setFieldValue("name", value.replace(/[- #$@!%^&()+="'?:*;,.<>\{\}\[\]\\\/]/gi, ''))
  }

  if(isLoading){
    return (<View style={{position: "absolute",top:60,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(60, 60, 60, 0.7)",
              justifyContent: "center",
              alignItems: "center",}}>
            <Spinner accessibilityLabel="Creando canal" size="xlg" color="indigo.500" />
            <Heading color="white" fontSize="lg">
            Creando canal...
            </Heading>
          </View>
          );  }

  return (
    <View style={styles.content}>
      <Pressable onPress={openGallery}>
        <Avatar
          bg="cyan.500"
          size="xl"
          source={{ uri: formik.values.image.uri || null }}
          style={[styles.image, formik.errors.image && styles.imageError]}
        >
          <Icon
            as={MaterialCommunityIcons}
            size="9"
            name="camera"
            color="primary.50"
          />
        </Avatar>
      </Pressable>

      <Input
        placeholder="Nombre del canal"
        maxLength={30}
        variant="unstyled"
        value={formik.values.name}
        onChangeText={(text) =>onTextChanged(text) }
        style={[styles.input, formik.errors.name && styles.inputError]}
      />
 

    {/*checkbox grupo uno a uno*/}
      <View style={{width:'100%', marginTop:10, marginBottom:10}}>

        <Checkbox shadow={2} size="lg" style={{}}  isChecked={isChecked}  onChange={() => handleTipoGrupoChange()} value={isChecked} aria-label={"xxxxxx"}
        icon={<Icon style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]  }} as={<MaterialCommunityIcons name="key" />}  />}    >

          <Text style={{color:'white'}}>{"Canal 1 to 1 (con llave de encriptado personalizada)"}</Text>

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