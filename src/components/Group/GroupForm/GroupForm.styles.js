import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({

  content: {
    position: "absolute",
    width: "100%",
    left: -10,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
    backgroundColor: "#171717",
    borderTopWidth: 1,
    borderTopColor: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    backgroundColor: "#29292b",
    color: "#fff",
    fontSize: 16,
    borderRadius: 50,
    marginLeft: -5,
    
  },
  select: {
    borderColor: "transparent",
    borderWidth:0,
    right: 10,
    backgroundColor: "#29292b",
    color: "#fff",
    fontSize: 9,
    borderRadius: 50,
    marginLeft: 5,
  },
  iconSend: {
    position: "absolute",
    top: 0,
    right: 10,
    height: "100%",
    color:'red'
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
  }
  
 

});
