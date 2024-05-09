import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import {
    configureObservablePersistence,
    persistObservable,
  } from '@legendapp/state/persist'
  import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
  import AsyncStorage from '@react-native-async-storage/async-storage'


const state$ = observable({
  users:[],
  groups:[],
  messages:[],
  grupoId:"",
  me:{},
  imgReplicada:"",
  flags:{
    cifrado:true,
    offline:false
  },
});

export default state$;