import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({
  itemsContainer: {
    backgroundColor: "black",
  },
  option: {
    backgroundColor: "#171717",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
  },
  optionRecordText: {
    color: "#fff",
    fontSize: 18,
    marginLeft:-2,
marginTop:1
  },
  optionRecordIcon: {
    color: "#fff",
    fontSize: 18,
    marginLeft:-14
  },
  optionStart: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  optionEnd: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cancel: {
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  iconRed:{
    color:'red'
  },
  iconCamera:{
    color:'gray',   
    textAlign:'center',
    fontSize:26 ,
    transform: [{scaleX: 1.2},{scaleY:1.2}],
  }
});