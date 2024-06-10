import { View } from "react-native";
import { useState } from "react";
import { Input } from "native-base";
import { createFilter } from "react-search-input";
import { styles } from "./Search.styles";

const KEYS_TO_FILTERS = ["email", "firstname", "lastname", "name"];

export function Search(props) {
  const { data, setData } = props;
  const [titulo, setTitulo] = useState("");

  const onSearch = (text) => {
  let tipoBusqueda="usuario";
    if(data[0]?.nip != null){
      console.log("listado de usuarios")
      tipoBusqueda="usuarios";
      setTitulo("Alias de usuario")
    }else{
      console.log("Listado de grupos")
      tipoBusqueda="grupos";
      setTitulo("Alias de canal")
    }

    const resultSearch = data.filter(createFilter(text, KEYS_TO_FILTERS));
    console.log(resultSearch)

    if(text.trim() =="" && tipoBusqueda=="usuarios"){
      setData([]);
    }else{
      setData(resultSearch);
    }
   
  };

  return (
    <View style={styles.content}>
      <Input
        placeholder={titulo}
        onChangeText={onSearch}
        style={styles.input}
        variant="unstyled"
      />
    </View>
  );
}
