import { Schema, model, Types, Document } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
  username: string;
  // Use `Types.ObjectId` in document interface...
  friends: Types.ObjectId[],
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      // And `Schema.Types.ObjectId` in the schema definition.
      type: Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
});

export default model<IUser>('User', schema);
