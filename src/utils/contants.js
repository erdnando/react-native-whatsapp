const SERVER_IP = "node-express-sockets-whatsapp-production-50d4.up.railway.app"; // DEV nube
//const SERVER_IP = "node-express-sockets-whatsapp-production-a1d6.up.railway.app";  //QA nube
//const SERVER_IP = "192.168.0.100:3977"; //DEV local

export const ENV = {
  SERVER_IP: SERVER_IP,
  BASE_PATH: `https://${SERVER_IP}`,
  API_URL: `https://${SERVER_IP}/api`,
  SOCKET_URL: `https://${SERVER_IP}`,
  ENDPOINTS: {
    AUTH: {
      REGISTER: "auth/register",
      LOGIN: "auth/login",
      REFRESH_ACCESS_TOKEN: "auth/refresh_access_token",
      TOKEN: "auth/token",
    },
    ME: "user/me",
    USER: "user",
    USER_ALL: "user/all",
    USER_EXCEPT_PARTICIPANTS_GROUP: "users_exept_participants_group",
    CHAT: "chat",
    CHAT_MESSAGE: "chat/message",
    CHAT_MESSAGE_IMAGE: "chat/message/image",
    CHAT_MESSAGE_LAST: "chat/message/last",
    CHAT_MESSAGE_TOTAL: "chat/message/total",
    GROUP: "group",
    GROUPAUTO: "groupauto",
    GROUP_EXIT: "group/exi//t",
    GROUP_BAN: "group/ban",
    GROUP_ADD_PARTICIPANTS: "group/add_participants",
    GROUP_MESSAGE: "group/message",
    GROUP_MESSAGE_EDIT: "group/message/edit",
    GROUP_MESSAGE_DELETE: "group/message/delete",
    GROUP_MESSAGE_IMAGE: "group/message/image",
    GROUP_MESSAGE_FILE: "group/message/file",
    GROUP_MESSAGE_TOTAL: "group/message/total",
    GROUP_MESSAGE_LAST: "group/message/last",
    GROUP_PARTICIPANTS_TOTAL: "group/participants/total",
  },
  JWT: {
    ACCESS: "access",
    REFRESH: "refresh",
  },
  ACTIVE_CHAT_ID: "active_chat_id",
  ACTIVE_GROUP_ID: "active_group_id",
};