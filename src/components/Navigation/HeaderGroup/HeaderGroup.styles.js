import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({
  container: {
    backgroundColor: "#171717",
    height: 100,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop:50
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    width:'80%',
  },
  iconosRight: {
    flexDirection: "row",
    alignItems: "center",
    width:'20%',
    marginLeft:-5
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
    color:'#41a4d8',
    fontSize:22,
    top:4,
    marginRight:0,
    width:25
  },
  iconOffline:{
    color:'red',
    fontSize:22,
    top:4,
    marginRight:-5,
    position:'absolute'
  },
  iconPwdNip:{
    fontSize:22,
    top:4,
    marginRight:10,
    width:25
  },
 
});
