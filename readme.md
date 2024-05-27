nvm install v20.11.1

nvm use v20.11.1

yarn install


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

---

Navigate to :
node_modules/native-base/src/core/NativeBaseProvider.tsx.

Delete that wraps {children}. Take care not to delete {children}.
Remove SSRProvider import. That is, delete this line import { SSRProvider } from '@react-native-aria/utils';

## Run: npx patch-package native-base.

Select yes in the prompt.

╰─ sqlite3 db.db ─╯
SQLite version 3.45.1 2024-01-30 16:01:20
Enter ".help" for usage hints.
sqlite> CREATE TABLE IF NOT EXISTS users ( \_id TEXT, email TEXT, firstname TEXT, lastname TEXT, password TEXT, avatar TEXT, nip TEXT, token TEXT, createdat TEXT, updatedat TEXT, avatar64 TEXT,nipraw TEXT);
sqlite> CREATE TABLE IF NOT EXISTS groups (\_id TEXT,name TEXT, participants TEXT, creator TEXT, image TEXT, image64 TEXT, createdat TEXT, updatedat TEXT);
sqlite> CREATE TABLE IF NOT EXISTS messages (\_id TEXT, grupo TEXT, user TEXT, message TEXT, tipo TEXT, tip_cifrado TEXT, forwarded TEXT, createdat TEXT, updatedat TEXT,file_name TEXT,file_type TEXT );
sqlite> .quit

//fnDropTableUsers();
//fnDropTableGroups();
//fnDropTableGroupMessages();

eas build --platform android --local <----generate .aab and .apk>

yarn start -c

git tag versionOfflineOK
git push origin --tags

#----------------------------------------

git push --force origin main

//--------merge de MAIN a QA---- (lo normal es q sea al reves)------
git checkout qa pasar de main a qa

git merge main desde qa hacer merge con main
git add .
git merge main
git status
git push origin --tags
git push origin qa
