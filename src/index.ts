import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyIO from 'fastify-socket.io';
import { MiddlewareRestoreSession } from './middlewares/MiddlewareRestoreSession';
import { SocketHandler } from './events/SocketHandler';
import { migrateUsers } from './domains/users/UsersMigration';

dotenv.config();

const server = fastify();

server.register(fastifyHelmet);

server.register(fastifyIO, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

server
  .ready()
  .then(() => {
    migrateUsers();
  })
  .then(() => {
    server.io.use(MiddlewareRestoreSession);
    server.io.on('connection', SocketHandler);
  });

server.listen(4000);
