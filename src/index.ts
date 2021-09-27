import fastify from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyIO from 'fastify-socket.io';
import { UserValidationMiddleware } from './middlewares/UserValidationMiddleware';
import { RestoreSessionMiddleware } from './middlewares/RestoreSessionMiddleware';
import { EventHandler } from './eventHandlers/SocketEventHandlers';

const server = fastify();

server.register(fastifyHelmet);

server.register(fastifyIO, {
  cors: {
    methods: ['GET', 'POST'],
  },
});

server.ready().then(() => {
  server.io.use(RestoreSessionMiddleware);
  server.io.use(UserValidationMiddleware);
  server.io.on('connection', EventHandler);
});

server.listen(4000);
