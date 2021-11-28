export const RoomsSchema = {
  name: 'Rooms',
  properties: {
    name: 'string',
    messages: {
      type: 'list',
      objectType: 'RoomMessage',
    },
    users: {
      type: 'list',
      objectType: 'string',
    },
  },
  primaryKey: 'name',
};

export const RoomsMessageSchema = {
  name: 'RoomMessage',
  embedded: true,
  properties: {
    id: 'int',
    user: 'string',
    value: 'string',
  },
};
