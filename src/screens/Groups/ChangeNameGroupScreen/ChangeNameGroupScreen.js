import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Input } from "native-base";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { Group, GroupMessage } from "../../../api";
import { useAuth } from "../../../hooks";
import { initialValues, validationSchema } from "./ChangeNameGroupScreen.form";
import { styles } from "./ChangeNameGroupScreen.styles";
import { AlertConfirm } from "../../../components/Shared";
import { UPDATE_STATE_ALLMESSAGES_LLAVE } from '../../../hooks/useDA';
import { Decrypt, DecryptWithLlave } from "../../../utils";
import * as statex$ from '../../../state/local';

const groupController = new Group();
const groupMessageController = new GroupMessage();

export function ChangeNameGroupScreen() {

  const navigation = useNavigation();
  const { params } = useRoute();
  const { accessToken, user } = useAuth();
  const [showAdvertencia, setShowAdvertencia] = useState(false);
  const [nombreG, setNombreG] = useState('');
  const [nuevaLlaveG, setNuevaLlaveG] = useState('');
  const [isGroupCreator, setIsGroupCreator] = useState(false);

  useEffect(() => {
    
    console.log("Datos de usuarios")
    console.log(user._id)
    console.log(params.creator)
    if(user._id === params.creator){
      console.log("Bienvenido creator del grupo")
      setIsGroupCreator(true)
    }
  }, [])
  


  const openCloseAdvertencia = () => setShowAdvertencia((prevState) => !prevState);

  const cambiosGrupo = async () => {
    try {
      console.log("cambios al grupo")
      console.log(params)
      console.log(nombreG)
      console.log(nuevaLlaveG)

      //actualizando nombre del grupo, si es q se modifico
       await groupController.update(accessToken, params.groupId, {name: nombreG}  );

      

       //update llave on local db
       /*if(params.tipo=="cerrado" && nuevaLlaveG.length>1){


        //get all messages of the group
        const respAllMessages = await groupMessageController.getAll(accessToken, params.groupId);

        console.log("decifrando con llave vieja")
        console.log(statex$.default.llaveGrupoSelected.get())

        const unlockedMessages = respAllMessages.messages;
          //loop group's messages and apply new crypted key, one by one
          unlockedMessages.map(async (msg) => {
      
            if(msg.type=="TEXT"){
              //decrypt message
              msg.message = Decrypt(msg.message, msg.tipo_cifrado), //DecryptWithLlave(msg.message, msg.tipo_cifrado, statex$.default.llaveGrupoSelected.get());
              console.log("mensaje decifrado")
              console.log(msg.message)
              //apply new crypted message
                                                        //accessToken, groupId,            message,     tipoCifrado,idMessage, tipox, nuevaLlaveG
              await groupMessageController.updateCifrados(accessToken, params.groupId, msg.message,msg.tipo_cifrado,msg._id, "cerrado", nuevaLlaveG);
            }

          });

          statex$.default.llaveGrupoSelected.set(nuevaLlaveG)
          //update new key at local db
          await UPDATE_STATE_ALLMESSAGES_LLAVE(nuevaLlaveG, params.groupId).then(result =>{

            statex$.default.llaveGrupoSelected.set(nuevaLlaveG)

            console.log("actualizando nueva llave")
            console.log(statex$.default.llaveGrupoSelected.get())
            navigation.goBack();
            navigation.goBack();
            navigation.goBack();
          }); 
       }else{
        
       }*/

       navigation.goBack();
        navigation.goBack();
        navigation.goBack();

           
    } catch (error) {
      console.error(error);
    }
  };
 
  const formik = useFormik({

    initialValues: initialValues(params.groupName,''),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        console.log("Datos del forulario q se actualizan::::::")
           console.log(formValue.name)
           console.log(formValue.llave)

           setNombreG(formValue.name)
           setNuevaLlaveG(formValue.llave)

           if(params.tipo=="abierto"){
            cambiosGrupo();//cambio dorecto del nombre del grupo
           }else{

            
            setShowAdvertencia(true);//advierte del cambio de llave
           }
           
           
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <View style={styles.content}>
      <Input
        placeholder="Nombre del grupo"
        variant="unstyled"
        value={formik.values.name}
        onChangeText={(text) => formik.setFieldValue("name", text)}
        style={[styles.input, formik.errors.name && styles.inputError]}
      />

      {/*<View display={isGroupCreator ? 'flex': 'none'} style={{width:'100%', marginTop:20}}>
        <Input display={ params?.tipo=="cerrado" ? 'flex': 'none'}
                placeholder="Nueva llave de cifrado del grupo"
                variant="unstyled"
                multiline={true}
                value={formik.values.llave}
                onChangeText={(text) => formik.setFieldValue("llave", text)}
                style={[styles.input, formik.errors.llave && styles.inputError]}
              />
      </View>*/}
     

      <Button
        onPress={formik.handleSubmit}
        style={styles.btn}
        isLoading={formik.isSubmitting}
      >
        Cambiar
      </Button>


      <AlertConfirm
        show={showAdvertencia}
        onClose={openCloseAdvertencia}
        textConfirm="Aplicar"
        onConfirm={cambiosGrupo}
        title="Cambio de llave de cifrado"
        message={`Esta seguro de que desea cambiar la llave de cifrado del grupo? Asegurese de notificar al otro miembro del grupo del cambio para que puedan seguir interactuando`}
        isDanger
      />

    </View>
  );
}