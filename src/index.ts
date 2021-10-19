import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyIO from 'fastify-socket.io';
import { UserValidationMiddleware } from './middlewares/UserValidationMiddleware';
import { RestoreSessionMiddleware } from './middlewares/RestoreSessionMiddleware';
import { SocketConnectionHandler } from './events/SocketEventHandlers';
import { connection } from './database/Connection';

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
    server.io.use(RestoreSessionMiddleware);
    server.io.use(UserValidationMiddleware);
  })
  .then(() => {
    connection;

    server.io.on('connection', SocketConnectionHandler);
  });

server.listen(4000);
