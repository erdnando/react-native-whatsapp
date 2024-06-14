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
      flex: 1,
      backgroundColor: isMe ? "#0891b2" : "#202333",
      maxWidth: "80%",
      borderRadius: 10,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    identity: {
      color: isMe ? "black" : "gray",
      marginBottom: 5,
      fontWeight: "bold",
      opacity: 0.8,
    },
    identityReplica:{
      color: isMe ? "black" : "gray",
      marginBottom: 5,
      fontWeight: "bold",
      opacity: 0.4,
    },
    identityMsgReplica:{
      color: isMe ? "black" : "gray",
      marginBottom: 5,
      
      opacity: 0.4,
      fontStyle:"italic"
    },
    text: {
      color: "#fff",
      fontSize: 16,
      marginBottom:10,
      backgroundColor:'rgba(52, 52, 52, 0.1)',
      borderRadius:8,
      margin:5,
      padding:5
    },
    date: {
      opacity: 1,
      color: "#fff",
      fontSize: 12,
      marginTop: 2,
      textAlign: "right",
    },
    vistoGris: {
      opacity: 0.4,
      color: isMe ? "white" : "transparent",
      fontSize: 22,
      top:-4
    },
    vistoVerde: {
      opacity: 0.9,
      color: isMe ? "#33ff55": "transparent",
      fontSize: 22,
      top:-2
    },
    dateEditado: {
      opacity: 1,
      color: "black",
      fontSize: 12,
      marginTop: 2,
      textAlign: "right",
      fontStyle:"italic",
      fontWeight:"bold"
    },
    cifrado: {
      fontWeight:"bold",
      color: "black",
      fontSize: 12,
      marginTop: 2,
      textAlign: "right",
      marginTop:-10
    },
    
    rowMenu:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:'space-between',
    },
    editOption:{
      
       
    },
    menu:{
      display:isMe ? "flex": "flex",
    },
    menuItem:{
      flex:1,
      borderBottomColor:'gray',
      borderBottomWidth:0,
      width:'100%',
      marginLeft:0
    },
    contentMenuItem:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      width:'100%',
    }

  });
};
