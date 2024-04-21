yarn add expo@latest

yarn start

urls controles: https://docs.nativebase.io/icon

# Build apk

//Just to initialize
npm install --global eas-cli && eas init --id f17ca1f6-8db0-4c47-b757-c5578aa1d780

//Every time it's needed to build an apk via expo
eas build -p android --profile preview

//to cast android screen to your pc, use airdroid cast app in your smartphone
//in your pc, opne this url: https://webcast.airdroid.com/connect

Navigate to :
node_modules/native-base/src/core/NativeBaseProvider.tsx.

Delete that wraps {children}. Take care not to delete {children}.
Remove SSRProvider import. That is, delete this line import { SSRProvider } from '@react-native-aria/utils';

Run: npx patch-package native-base.

Select yes in the prompt.

CREATE TABLE IF NOT EXISTS users (\_id TEXT PRIMARY KEY,email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, avatar64 TEXT);
CREATE TABLE IF NOT EXISTS groups (\_id TEXT PRIMARY KEY,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT);
CREATE TABLE IF NOT EXISTS groupmessages (\_id TEXT PRIMARY KEY,grupo TEXT, user TEXT, message TEXT, type TEXT, tipo_cifrado TEXT, forwarded TEXT, createdAt TEXT, updatedAt TEXT,file64 TEXT);
.quit
