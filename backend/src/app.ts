import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import datesRoute from './routes/dates';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ourDayDB')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/dates', datesRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});