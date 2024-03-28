import { useState } from "react";
import { NativeModules, Platform } from 'react-native';
import CryptoJS from 'crypto-js';
import key from '../../secretKey';

/*
//var Aes = NativeModules.Aes;

//export function  generateKey(password, salt, cost, length){
//  return Aes.pbkdf2(password, salt, cost, length);
//} 
const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

export function  encryptData(text, key){
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
        cipher,
        iv,
    }))
})
} 
const encrypt = (text, key) => {
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
      cipher,
      iv,
    }));
  });
};

/*export function  decryptData(encryptedData, key){
 return Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc');
} 
const decrypt = async (encryptedData, key) => {
  console.log({encryptedData, key});
  return Aes.decrypt(
    encryptedData.cipher,
    key,
    encryptedData.iv,
    'aes-256-cbc',
  );
};
*/


/*
export function proceso(){
  generateKey('Arnold', 'salt', 5000, 256).then(key => {
    console.log('Key:', key);
    encrypt('These violent delights have violent ends', key)
      .then(({cipher, iv}) => {
        console.log('Encrypted:', cipher);
        //setData({cipher, iv, key});
      })
      .catch(error => {
        console.error(error);
      });
  });
};

const getDec = async () => {
  var {cipher, key, iv} = data;
  decrypt({cipher, iv}, key).then(decrypted => {
    console.log({decrypted});
   // setDec(decrypted);
  });
};
*/

const Encrypt = word =>{
  
  return CryptoJS.AES.encrypt(word,key).toString();
}

const Decrypt = word =>{
  
  return CryptoJS.AES.decrypt(word,key).toString(CryptoJS.enc.Utf8);
}

export {Encrypt,Decrypt};


