// Resolvers tell Apollo Server how to fetch the data associated

import { GraphQLError } from "graphql";
import PersonModel, { IPerson } from "./models/person";
import UserModel from "./models/user";

import jwt from "jsonwebtoken";

import { Resolvers } from "./generated/graphql";

// with a particular type.
const resolvers: Resolvers = {
  Query: {
    personCount: async () => await PersonModel.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return await PersonModel.find({});
      }

      return await PersonModel.find({
        phone: { $exists: (args.phone === 'YES') },
      });
    },
    findPerson: async (root, args) => {
      return await PersonModel.findOne({ name: args.name });
    },
    me: (root, args, { currentUser }) => {
      return currentUser;
    },
  },
  Person: {
    // The parameter root of the resolver function is the person-object
    address: (root) => {
      return { 
        street: root.street,
        city: root.city
      }
    }
  },
  User: {
    friends: async (root) => {
      const user = await UserModel
        .findById(root.id)
        .populate<{ friends: IPerson[] }>('friends');

      return user.friends;
    },
  },
  Mutation: {
    addPerson: async (root, args, { currentUser }) => {
      const person = new PersonModel({ ...args })

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        });
      }

      try {
        await person.save();
        currentUser.friends = currentUser.friends.concat(person.id);
        await currentUser.save();

      } catch (error) {
        throw new GraphQLError('Saving person failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          }
        });
      }

      return person;
    },
    editNumber: async (root, args) => {
      const person = await PersonModel.findOne({ name: args.name });
      person.phone = args.phone;

      try {
        await person.save();
      } catch (error) {
        throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }

      return person;
    },
    createUser: async (root, args) => {
      const user = new UserModel({ username: args.username })

      return await user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await UserModel.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        }) 
      }

      const isFriend = (person: IPerson) => 
        currentUser.friends
          .includes(person.id)
          //.map(f => f._id.toString())
          //.includes(person._id.toString())
  
      const person = await PersonModel.findOne({ name: args.name })
      if (person && !isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person.id)
        await currentUser.save();
      }
  
      return currentUser
    },
  }
}

export default resolvers;
