import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({
  container: {
    height: "100%",
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  bottomActions: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: 50,
    left: -20,
    padding: 10,
  },
  icon: {
    color: "red",
  },
  iconclose: {
    color: "white",
    marginTop:10,
    marginLeft:5,
    padding:10
  },
  iconBackground: {
    backgroundColor: "#202020",
    borderRadius: 50,
  },
  button: {
    marginTop:-9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderRadius: 4,
    elevation: 0,
    backgroundColor: 'white',
    height:20,
  },
  text: {
    fontSize: 13,
    lineHeight: 25,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginTop:-3

  },
  iconInnerAudio:{
    position:'relative',
    marginLeft:10,
    marginTop:13,
    fontSize:18,
    color:'red',
    transform: [{scaleX: 1.8},{scaleY:1.8}],
  },
});
