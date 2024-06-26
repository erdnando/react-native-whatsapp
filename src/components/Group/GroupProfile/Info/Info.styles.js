import { StyleSheet } from "react-native";

export const styles = new StyleSheet.create({
  content: {
    alignItems: "center",
  },
  contentEdit: {
    alignItems: "center",
    backgroundColor:'transparent',
    opacity:0.9,
    borderRadius:8,
    padding:4
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  type: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    opacity: 0.9,
  },
});