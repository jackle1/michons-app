import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import datesRoute from './routes/dates';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://root:Jackle01!@ourday.nbug0er.mongodb.net/';
console.log("hi")

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/dates', datesRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});