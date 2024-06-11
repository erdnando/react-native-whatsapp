import { useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { map } from "lodash";
import { ItemText } from "./ItemText";
import { ItemImage } from "./ItemImage";
import { ItemFile } from "./ItemFile";
import { styles } from "./ListMessages.styles";
import * as statex$ from '../../../state/local'
import { EventRegister } from "react-native-event-listeners";

export function ListMessages(props) {
  const { messages } = props;
  const scrollViewRef = useRef();

  //=================================================================
  useEffect(() => {
      const updateVisto = EventRegister.addEventListener("idMessagevisto", async idMsg=>{
      console.log("actualizando estatus de visto en la vista...", idMsg);
    
      var foundIndex = messages.findIndex(x => x._id == idMsg);
      messages[foundIndex].estatus = "LEIDO";

         
    });

    return ()=>{
      EventRegister.removeEventListener(updateVisto);
    }
  }, [])
  
  
 //================================================================

  return (
    <ScrollView
      style={styles.container}
      alwaysBounceVertical={false}
      ref={scrollViewRef}
      onContentSizeChange={() => {

        console.log("moving to bottom")
        console.log(statex$.default.moveScroll.get())
        if(statex$.default.moveScroll.get()){
          scrollViewRef.current.scrollToEnd({ animated: false });
        }
       
       
      }}
    >
      <View style={styles.content}>
        {map(messages, (message) => {
          if (message.type === "TEXT") {
            return <ItemText key={message._id} message={message} />;
          }
          if (message.type === "IMAGE") {
            return <ItemImage key={message._id} message={message} />;
          }

          if (message.type === "FILE") {
            return <ItemFile key={message._id} message={message} />;
          }
        })}
      </View>
    </ScrollView>
  );
}
