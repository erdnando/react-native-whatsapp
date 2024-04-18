import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({
  itemsContainer: {
    backgroundColor: "transparent",
  },
  option: {
    backgroundColor: "#171717",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
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
