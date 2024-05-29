import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";


import {
    configureObservablePersistence,
    persistObservable,
  } from '@legendapp/state/persist'
  import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
  import AsyncStorage from '@react-native-async-storage/async-storage'
  

const state$ = observable({
  isConnected:true,
  expoPushToken:{},
  llaveGrupoSelected:"",
  AUTHLOGIN:{},
  lastPushNotification:"",
  user:[{
     _id :"0",
     email :"",
     firstname :"",
     lastname :"", 
     password :"", 
     avatar :"", 
     nip :"", 
     avatar64 :"",
     access :"",
     me :""
  }],
  groups:[
    {
        _id :"0",
        name :"", 
        participants :[], 
        creator :"", 
        image :"", 
        image64 :""
    },
  ],
  groupmessages:[{
    _id  :"0",
    group  :"", 
    user  :"", 
    message  :"", 
    type  :"", 
    tipo_cifrado  :"",
    email_replied:"",
    message_replied:"",
    tipo_cifrado_replied:"", 
    forwarded  :"", 
    createdAt  :"", 
    updatedAt  :"",
    file64  :""
  }],
  flags:{
    cifrado:true,
  },
});

export default state$;