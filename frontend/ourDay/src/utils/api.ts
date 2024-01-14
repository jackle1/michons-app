import axios from 'axios';
import { IDate } from "./IDate"

const BASE_URL = 'http://ourDay.us-east-2.elasticbeanstalk.com'; //IP address in wifi settings

export const fetchDates = async (): Promise<IDate[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/dates`);
    if (response.data && response.data.dates) {
      return response.data.dates.map((item: { _id: string, date: string, name: string }) => ({
        _id: item._id,
        date: new Date(item.date), // Convert string to Date object
        name: item.name
      }));
    }
    return [];
  } catch (error) {
    throw new Error('Error fetching dates');
  }
};

export const deleteDate = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/dates/${id}`);
  } catch (error) {
    throw new Error('Error deleting date');
  }
};

export const addDate = async (date: Date, name: string): Promise<IDate> => {
  try {
      const response = await axios.post(`${BASE_URL}/dates/add`, {
          date: date.toISOString(),
          name: name
      });
      if (response.data) {
          return {
              _id: response.data._id,
              date: new Date(response.data.date),
              name: response.data.name
          };
      } else {
          throw new Error('Invalid response from server');
      }
  } catch (error) {
      throw new Error('Error adding date');
  }
};