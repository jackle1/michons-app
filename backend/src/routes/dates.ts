import express, { Request, Response } from 'express';
import DateModel, { IDate } from '../models/Date';

const router = express.Router();

// Fetch all dates
router.get('/', async (req: Request, res: Response) => {
  try {
    const dates: IDate[] = await DateModel.find().sort({ date: 1 }); // 1 for ascending order
    res.json({ dates });
  } catch (err) {
    res.status(500).json({ message: 'Unable to get dates' });
  }
});

// Add a date
router.post('/add', async (req: Request, res: Response) => {
  const { date } = req.body;
  const newDate = new DateModel({ date });

  try {
    const savedDate: IDate = await newDate.save();
    res.status(201).json(savedDate);
  } catch (err) {
    res.status(400).json({ message: 'Unable to add' });
  }
});

// Delete a date DOESN'T WORK
router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deletedDate = await DateModel.findByIdAndDelete(req.params.id) as unknown as IDate | null;
      if (!deletedDate) {
        return res.status(404).json({ message: 'Date not found' });
      }
      res.json({ message: 'Date deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Unable to delete' });
    }
});

export default router;