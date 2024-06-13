import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';

import express from "express";
import http from "http";
import cors from 'cors';

import jwt from 'jsonwebtoken';

import { readFileSync } from 'fs';

import { connectToDatabase } from './dataSource';
import resolvers from './resolvers';

import UserModel, { IUser } from './models/user';

export interface MyContext {
  currentUser?: IUser;
}

const PORT = 4000;

const start = async () => {
  await connectToDatabase();

  const app = express();

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Note: this uses a path relative to the project's
  // root directory, which is the current working directory
  // if the server is executed using `npm run`.
  const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

  const server = new ApolloServer<MyContext>({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      // The object returned by context is given to all resolvers as their
      // third parameter. Context is the right place to do things which are
      // shared by multiple resolvers, like user identification.
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;

        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken: any = jwt.verify(auth.substring(7), process.env.JWT_SECRET);

          // populate in User resolver instead
          const currentUser = await UserModel
            .findById(decodedToken.id)
            // .populate<{ friends: IPerson[] }>('friends');

          return { currentUser };
        }
      },
    }),
  );

  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
  });
};

start();
