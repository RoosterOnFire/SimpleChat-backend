import fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import {
  restoreSessionMiddleware,
  userValidationMiddleware,
} from './middlewares/SocketMiddleware';
import { EventHandler } from './eventHandlers/SocketEventHandlers';

const server = fastify();

server.register(fastifyIO, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

server.ready().then(() => {
  server.io.use(restoreSessionMiddleware);
  server.io.use(userValidationMiddleware);
  server.io.on('connection', EventHandler);
});

server.listen(4000);
