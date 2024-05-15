import { StyleSheet } from "react-native";

export const styled = (isMe) => {
  return new StyleSheet.create({
    content: {
      flexDirection: "row",
      justifyContent: isMe ? "flex-end" : "flex-start",
      marginHorizontal: 10,
      marginBottom: 10,
    },
    message: {
      backgroundColor: isMe ? "#0891b2" : "#202333",
      maxWidth: "80%",
      borderRadius: 10,
      padding: 3,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    identity: {
      color: "black",
      marginBottom: 5,
      fontWeight: "bold",
      opacity: 0.8,
    },
    image: {
      borderRadius: 10,marginTop:10,
      //   height: 100,
      //   width: "100%",
    },
    date: {
      position: "absolute",
      bottom: 10,
      right: 10,
      color: "#fff",
      fontSize: 12,
      marginTop: 0,
      textAlign: "right",
    },
    rowMenu:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:'space-between',
    },
    colFile:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor:"transparent",
      height:65,
      bottom:-8
    
    },
    menuItem:{
      flex:0,
      borderBottomColor:'gray',
      borderBottomWidth:0,
      width:'100%',
      marginLeft:0,
  
    },
    menu:{
      display:isMe ? "flex": "flex",
    },
    contentMenuItem:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      width:'100%',
    },
    cifrado: {
      position:'absolute',
      fontWeight:"bold",
      color: "red",
      fontSize: 12,
      bottom: 30,
      textAlign: "right",
      top:15
    },
  });
};
