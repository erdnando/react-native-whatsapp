import { useState,useRef } from "react";
import { NativeModules, Platform } from 'react-native';
import CryptoJS from 'crypto-js';
import * as statex$ from '../state/local'

//https://www.npmjs.com/package/crypto-js
/*
crypto-js/aes
crypto-js/tripledes
crypto-js/rc4
crypto-js/rabbit
crypto-js/rabbit-legacy
crypto-js/evpkdf
*/


const Encrypt = (word,tipo) =>{

  let qey=statex$.default.llaveGrupoSelected.get()
  let cifrado='';


  console.log("Encryptando con llave::" + statex$.default.llaveGrupoSelected.get())
  switch (tipo) {
    case 'AES': cifrado=CryptoJS.AES.encrypt(word,qey).toString(); break;
    case '3DES': cifrado=CryptoJS.TripleDES.encrypt(word,qey).toString(); break;
    case 'RC4': cifrado=CryptoJS.RC4.encrypt(word,qey).toString(); break;
    case 'RABBIT': cifrado=CryptoJS.Rabbit.encrypt(word,qey).toString(); break;
    default:cifrado=CryptoJS.AES.encrypt(word,qey).toString(); break;
      break;
  }
 
  return cifrado;
}
//===================================================================================================
const Decrypt = (word, tipo) =>{

  let decifrado='';
  let qey=statex$.default.llaveGrupoSelected.get()

 
  console.log("Decriptando con llave generica::" + tipo + ":::" + statex$.default.llaveGrupoSelected.get() + " word:::" + word)
  
  switch (tipo) {
    case 'AES': decifrado=CryptoJS.AES.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    case '3DES': decifrado=CryptoJS.TripleDES.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    case 'RC4': decifrado=CryptoJS.RC4.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    case 'RABBIT': decifrado=CryptoJS.Rabbit.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    default:decifrado=CryptoJS.AES.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
      break;
  }
  console.log(decifrado)
  return decifrado;
}



const DecryptWithLlave = (word, tipo, qey) =>{

  let decifrado='';
  
    console.log("Decriptando con llave::" + qey)

  
  switch (tipo) {
    case 'AES': decifrado=CryptoJS.AES.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    case '3DES': decifrado=CryptoJS.TripleDES.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    case 'RC4': decifrado=CryptoJS.RC4.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    case 'RABBIT': decifrado=CryptoJS.Rabbit.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
    default:decifrado=CryptoJS.AES.decrypt(word,qey).toString(CryptoJS.enc.Utf8); break;
      break;
  }
  return decifrado;
}

const EncryptWithLlave = (word,tipo, qey) =>{

  let cifrado='';
   
  console.log("Encryptando con llave::" + qey)
  switch (tipo) {
    case 'AES': cifrado=CryptoJS.AES.encrypt(word,qey).toString(); break;
    case '3DES': cifrado=CryptoJS.TripleDES.encrypt(word,qey).toString(); break;
    case 'RC4': cifrado=CryptoJS.RC4.encrypt(word,qey).toString(); break;
    case 'RABBIT': cifrado=CryptoJS.Rabbit.encrypt(word,qey).toString(); break;
    default:cifrado=CryptoJS.AES.encrypt(word,qey).toString(); break;
      break;
  }
 
  return cifrado;
}

//============================================================================
const MD5method = (word)=>{
  return CryptoJS.MD5(word).toString();
}






export {Encrypt, Decrypt, MD5method, DecryptWithLlave, EncryptWithLlave};