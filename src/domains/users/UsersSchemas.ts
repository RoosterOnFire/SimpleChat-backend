export const UserSchema = {
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

export const UserMetaSchema = {
  name: 'UserMeta',
  properties: {
    role: 'string',
  },
};
