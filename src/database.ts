import { Users } from './types/type';

export let ChatRoomUsers: Users = [];

export function getCount() {
  return ChatRoomUsers.filter((user) => user.nickname.length).length;
}

export function getUser(id: string) {
  return ChatRoomUsers.find((user) => user.id === id);
}

export function getUsers() {
  return ChatRoomUsers.filter((user) => user.nickname.length);
}

export function addUser(id: string, nickname: string) {
  ChatRoomUsers.push({ id, nickname });
}

export function updateUserNickname(id: string, nickname: string) {
  if (!nickname) return;

  const userIndex = ChatRoomUsers.findIndex((user) => user.id === id);

  ChatRoomUsers[userIndex].nickname = nickname;
}

export function removeUser(id: string) {
  ChatRoomUsers = ChatRoomUsers.filter((user) => user.id !== id);
}

export function isExistingNickname(nickname: string) {
  return ChatRoomUsers.findIndex((user) => user.nickname === nickname) !== -1;
}
