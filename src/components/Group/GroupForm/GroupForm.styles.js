import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({

  content: {
    position:'relative',
    paddingLeft:20,
    paddingTop: 15,
    paddingBottom: 40,
    backgroundColor: "#171717",
    borderTopWidth: 1,
    borderTopColor: "#333",
    flexDirection: "row",
    alignContent:'space-around',

  },
  inputContainer: {
    flex: 1,
    position: "relative",
    flexDirection: 'row',
    marginLeft:5,
  
    alignContent:'space-around'
  },
  input: {
    backgroundColor: "#29292b",
    color: "#fff",
    fontSize: 16,
    borderRadius: 50,
    height:38,
    width:'95%',
    borderWidth:2,
    borderStyle:'dotted',
   marginLeft:5,
   paddingLeft:15
  },
  select: {
    borderColor: "transparent",
    borderWidth:0,
    backgroundColor: "#29292b",
    color: "#fff",
    fontSize: 9,
    borderRadius: 50,
  
  },
  iconSend: {
    position: "relative",
    right:38,
    color:'white'
  },
  iconCrypto: {
    position: "absolute",
    top: 13,
    left:36,
    fontSize: 20,
    width:40,
    height:40,
    color:'red'
  },
  iconRed:{
    color:'red'
  },
  iconAudio:{
    color:'gray',
    position:'relative',
    right:12,
    marginLeft:10,
    fontSize:22
  }
  
 

});
