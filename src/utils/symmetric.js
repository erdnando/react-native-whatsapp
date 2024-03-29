import { useState } from "react";
import { NativeModules, Platform } from 'react-native';
import CryptoJS from 'crypto-js';
import key from '../../secretKey';

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


  let cifrado='';
  switch (tipo) {
    case 'AES': cifrado=CryptoJS.AES.encrypt(word,key).toString(); break;
    case '3DES': cifrado=CryptoJS.TripleDES.encrypt(word,key).toString(); break;
    case 'RC4': cifrado=CryptoJS.RC4.encrypt(word,key).toString(); break;
    case 'RABBIT': cifrado=CryptoJS.Rabbit.encrypt(word,key).toString(); break;
    default:cifrado=CryptoJS.AES.encrypt(word,key).toString(); break;
      break;
  }
  return cifrado;
}

const Decrypt = (word,tipo) =>{
  let decifrado='';
  switch (tipo) {
    case 'AES': decifrado=CryptoJS.AES.decrypt(word,key).toString(); break;
    case '3DES': decifrado=CryptoJS.TripleDES.decrypt(word,key).toString(); break;
    case 'RC4': decifrado=CryptoJS.RC4.decrypt(word,key).toString(); break;
    case 'RABBIT': decifrado=CryptoJS.Rabbit.decrypt(word,key).toString(); break;
    default:decifrado=CryptoJS.AES.decrypt(word,key).toString(); break;
      break;
  }
  return decifrado;
}
//============================================================================


export {Encrypt,Decrypt};


