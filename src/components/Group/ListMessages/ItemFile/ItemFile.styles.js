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
      paddingBottom:30,
      paddingTop:5,
      paddingHorizontal: 10,
    },
    identity: {
      color: isMe ? "black" : "gray",
      marginBottom: 5,
      fontWeight: "bold",
      opacity: 0.8,
    },
    image: {
      borderRadius: 10,
      //   height: 100,
      //   width: "100%",
    },
    date: {
      position: "absolute",
      bottom: 8,
      right: 33,
      color: "#fff",
      fontSize: 12,
      marginTop: 2,
      textAlign: "right",
    },
    rowMenu:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:'space-between',
    },
    rowFile:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:'space-between',
      marginBottom:25,
      marginTop:10,
    },
    fileName: {
      color: "#fff",
      marginBottom: 5,
      fontWeight: "bold",
      opacity: 0.4,
      width:200,
      marginLeft:5
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
      fontWeight:"bold",
      color: "black",
      fontSize: 12,
      top: -12,
      textAlign: "right",
      marginTop:-5,
      marginBottom:6
    },
    containerVideo: {
      position: "relative",
      backgroundColor:'black'
    },
    video: {
      height: "95%",
      width: "100%",
    },
    topActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      width: "100%",
      top: 0,
      left: 0,
      padding: 10,
    },
    bottomActions: {
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: "center",
      position: "absolute",
      width: "100%",
      bottom: 50,
      left: 0,
      padding: 10,
    },
    icon: {
      color: "#fff",
    },
    totalSize: {
      fontWeight:"bold",
      color: "black",
      fontSize: 12,
      top: 0,
      textAlign: "left",
      marginTop:-15,
      marginBottom:0
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
    dateCrypt: {
      position: "absolute",
     
      right: 10,
      color: "#fff",
      fontSize: 12,
      bottom: 6,
      textAlign: "right",
    },

  });
};
