export type TypeRoom = {
  name: 'string';
  messages: TypeRoomMessage[];
  users: string[];
};

export type TypeRoomMessage = {
  id: 'int';
  user: 'string';
  value: 'string';
};
