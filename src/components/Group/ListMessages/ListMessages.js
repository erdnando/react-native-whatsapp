import { useRef } from "react";
import { ScrollView, View } from "react-native";
import { map } from "lodash";
import { ItemText } from "./ItemText";
import { ItemImage } from "./ItemImage";
import { ItemFile } from "./ItemFile";
import { styles } from "./ListMessages.styles";
import { Decrypt,Encrypt } from "../../../utils";
import { Auth } from "../../../api";
import * as statex$ from '../../../state/local'

const authController = new Auth();

export function ListMessages(props) {
  const { messages } = props;
  const scrollViewRef = useRef();


 

  return (
    <ScrollView
      style={styles.container}
      alwaysBounceVertical={false}
      ref={scrollViewRef}
      onContentSizeChange={() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
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