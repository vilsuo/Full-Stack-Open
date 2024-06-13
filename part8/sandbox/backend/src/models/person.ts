import { Schema, model, Document } from 'mongoose';

export interface IPerson extends Document {
  name: string;
  phone?: string;
  street: string;
  city: string;
}

const schema = new Schema<IPerson>({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
});

export default model<IPerson>('Person', schema);
