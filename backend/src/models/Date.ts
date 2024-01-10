import mongoose, { Schema, Document } from 'mongoose';

export interface IDate extends Document {
  date: Date;
}

const DateSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true
  },
  name: { type: String, default: "Michon and Jack's Day <3" }
});

export default mongoose.model<IDate>('Date', DateSchema);