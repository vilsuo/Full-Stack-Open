import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';

import jwt from 'jsonwebtoken';

import mongoose from 'mongoose';
import { connectToDatabase } from './mongo';
import Book from './models/book';
import Author from './models/author';
import User from './models/user';

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allUsers: [User!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const getErrors = (error: mongoose.Error.ValidationError) => {
  const errors = {};

  Object.keys(error.errors).forEach((key) => {
    errors[key] = error.errors[key].message;
  });

  return errors;
};

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const { author: name, genre } = args;

      let bookFilter = {}
      if (name) {
        const author = await Author.findOne({ name });
        if (!author) { return []; }

        bookFilter = { ...bookFilter, author: author._id }
      }

      if (genre) {
        bookFilter = {
          ...bookFilter,
          genres: { $in : [genre] },
        };
      }

      return await Book.find(bookFilter);
    },
    allAuthors: async () => Author.find({}),
    allUsers: async () => User.find({}),
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      let author = await Author.findOne({ name: args.author });
      try {
        if (!author) {
          author = new Author({ name: args.author })
          await author.save();
        }

        const newBook = new Book({ ...args, author });
        return await newBook.save();

      } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError("Adding book failed", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: getErrors(error),
            },
          });
        }
        throw error;
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Authentication required", {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      const { name, setBornTo } = args;

      try {
        const author = await Author.findOneAndUpdate({ name }, { born: setBornTo }, {
          new: true, // return the modified document rather than the original
          runValidators: true, // update validators are off by default
        });

        return author;

      } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError("Editing author failed", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: getErrors(error),
            },
          });
        }
        throw error;
      }
    },

    createUser: async (root, args) => {
      const { username, favoriteGenre } = args;

      const user = new User({ username, favoriteGenre });
      try {
        return await user.save();

      } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new GraphQLError("Creating user failed", {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: getErrors(error),
            },
          });
        }
        throw error;
      }
    },
    login: async (root, args) => {
      const { username, password } = args;
      const user = await User.findOne({ username });
      if (!user || password !== 'secret') {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const token = jwt.sign(
        { id: user._id, username: user.username, },
        process.env.JWT_SECRET
      );

      return { value: token };
    },
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id }),
  },
  Book: {
    author: async (root) => await Author.findById(root.author),
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const start = async () => {
  await connectToDatabase();
  
  startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken: any = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
};

start();
