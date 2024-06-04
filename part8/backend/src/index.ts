import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';

import mongoose from 'mongoose';
import { connectToDatabase } from './mongo';
import Book from './models/book';
import Author from './models/author';

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
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
  },
  Mutation: {
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {
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
    }
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
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
};

start();
