import { useRef, useEffect, useState } from "react";
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
 
  
  
 //================================================================

      return (
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          ref={scrollViewRef}
          onContentSizeChange={() => {

            //console.log("moving to bottom")
            //console.log(statex$.default.moveScroll.get())
            if(statex$.default.moveScroll.get()){
              scrollViewRef.current.scrollToEnd({ animated: false });
            }
          
          
          }}
        >
          <View style={styles.content}>
            {
              map(messages, (message) => {
                   
                    
                      console.log(message._id)
                     // console.log(statex$.default.idMessageEstatus.get())
                    // console.log("son iguales::::")
                      //console.log(message._id === statex$.default.idMessageEstatus.get())

                      //console.log("allSeen::::")
                      //console.log(allSeen)
                      //console.log("message.estatus")
                      //console.log(message.estatus)
                     // message.estatus="LEIDO";
                      
                      if (message.type === "TEXT") {
                        //if(statex$.default.actualizaEstatus.get()){ if(message._id === statex$.default.idMessageEstatus.get()){ message.estatus="LEIDO"};   }
                        return <ItemText key={message._id} message={message} />;
                      }
                      if (message.type === "IMAGE") {
                      // if(statex$.default.actualizaEstatus.get()){ if(message._id === statex$.default.idMessageEstatus.get()){ message.estatus="LEIDO"};   }
                        return <ItemImage key={message._id} message={message} />;
                      }

                      if (message.type === "FILE") {
                        //if(statex$.default.actualizaEstatus.get()){ if(message._id === statex$.default.idMessageEstatus.get()){ message.estatus="LEIDO"};   }
                        return <ItemFile key={message._id} message={message} />;
                      }
                      
                    })

                   
            }
          </View>
        </ScrollView>
      );

}
