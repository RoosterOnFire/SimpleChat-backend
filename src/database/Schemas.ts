export const SchemaUser = {
  name: 'User',
  properties: {
    password: 'string',
    sessionId: 'string?',
    socketId: 'string?',
    userId: 'string',
    username: 'string',
  },
  primaryKey: 'userId',
};

export const SchemaUserMeta = {
  name: 'UserMeta',
  properties: {
    role: 'string',
  },
};

export const SchemaRooms = {
  name: 'Rooms',
  properties: {
    name: 'string',
    messages: {
      type: 'list',
      objectType: 'RoomMessage',
    },
  },
};

export const SchemaRoomMessge = {
  name: 'RoomMessage',
  embedded: true,
  properties: {
    id: 'int',
    user: 'string',
    value: 'string',
  },
};
