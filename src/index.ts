import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyIO from 'fastify-socket.io';
import { MiddlewareRestoreSession } from './middlewares/MiddlewareRestoreSession';
import { SocketHandler } from './events/SocketHandler';
import { UsersSeed } from './domains/users/UsersSeed';

dotenv.config();

const server = fastify();

server.register(fastifyHelmet);

server.register(fastifyIO, {
  cors: { methods: ['GET', 'POST'] },
});

server
  .ready()
  .then(() => {
    if (process.env.seed === 'true') {
      UsersSeed();
    }
  })
  .then(() => {
    server.io.use(MiddlewareRestoreSession);
    server.io.on('connection', SocketHandler);
  });

server.listen(4000);
