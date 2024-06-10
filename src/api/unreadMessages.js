import AsyncStorage from "@react-native-async-storage/async-storage";

export class UnreadMessages {
  async getTotalReadMessages(groupId) {
    const response = await AsyncStorage.getItem(`${groupId}_read`);
    return Number(response);
  }

  async setTotalReadMessages(groupId, total) {
    await AsyncStorage.setItem(`${groupId}_read`, JSON.stringify(total));
  }
}