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
    borderRadius: 10,
    width:'95%',
    borderWidth:2,
    borderStyle:'dotted',
   marginLeft:5,
   paddingLeft:15,
   paddingRight:35,
   height:'100%'
  },
  textReply:{
    backgroundColor: "#29292b",
    color: "#fff",
    fontSize: 16,
    borderRadius: 10,
    borderWidth:2,
    marginLeft:5,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
    paddingBottom:10,
    width:'100%',
  },
  select: {
    borderColor: "transparent",
    borderWidth:0,
    backgroundColor: "#29292b",
    color: "#fff",
    fontSize: 9,
    borderRadius: 10,
    top:-3,
  marginTop:5
  },
  iconSend: {
    position: "relative",
    right:38,
    color:'white'
  },
  iconCrypto: {
    position: "absolute",
    top: 17,
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
    position:'relative',
    right:12,
    marginLeft:10,
    fontSize:22,
    color:'gray',
    transform: [{scaleX: 1.2},{scaleY:1.2}],
  },
  iconInnerAudio:{
    position:'relative',
    marginLeft:10,
    marginTop:13,
    fontSize:18,
    color:'red',
    transform: [{scaleX: 1.8},{scaleY:1.8}],
  },
  iconAudioRecording:{
    position:'relative',
    borderColor:'red',
    backgroundColor:'red',
    borderWidth:3,
    width:19,
    height:20,
    borderRadius:40,
    transform: [{scaleX: 2},{scaleY:2}],
marginTop:-4,
marginRight:8
    
  },
  iconCloseReply:{
    color:'gray',
    position:'relative',
    right:12,
    marginLeft:2,
    fontSize:22,
    alignContent:'space-between',
    right:5
  },
  iconRecording:{
    color:'red',
    position:'relative',
    right:12,
    marginLeft:2,
    fontSize:22,
    alignContent:'space-between',
    right:5,
    transform: [{scaleX: 1.8},{scaleY:1.8}],
  },
  identity: {
    color: "#fff",
    marginBottom: 0,
    marginTop:10,
    fontWeight: "bold",
    opacity: 0.4,
    marginLeft:20
  },
  bottomSheet:{
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentBottomSheet:{
    flex: 1,
    alignItems: 'center',
  }
 

});
