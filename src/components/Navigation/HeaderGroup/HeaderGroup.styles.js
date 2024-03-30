import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({
  container: {
    backgroundColor: "#171717",
    height: 95,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginLeft: 30,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconLocked:{
    color:'green',
    fontSize:22,
    top:4,
    marginRight:-10,
    width:25
  },
  iconPwdNip:{
    fontSize:22,
    top:4,
    marginRight:10,
    width:25
  }
});
