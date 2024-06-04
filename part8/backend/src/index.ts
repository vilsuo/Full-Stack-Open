import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

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
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save();
      }

      const newBook = new Book({ ...args, author });
      return await newBook.save();
    },
    editAuthor: async (root, args) => {
      const { name, setBornTo } = args;
      const author = await Author.findOne({ name });
      if (!author) { return null; }
    
      author.born = setBornTo;
      return await author.save();
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
