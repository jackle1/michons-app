import mongoose, { Schema, Document } from 'mongoose';

export interface IDate extends Document {
  date: Date;
}

const DateSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true
  }
});

export default mongoose.model<IDate>('Date', DateSchema);