import axios from 'axios';

const BASE_URL = 'http://192.168.1.81:3000'; //IP address in wifi settings

export const fetchDates = async (): Promise<Date[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/dates`);
    if (response.data && response.data.dates) {
      return response.data.dates.map((item: { date: string }) => new Date(item.date));
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

export const addDate = async (date: Date): Promise<Date> => {
    try {
      const response = await axios.post(`${BASE_URL}/dates/add`, { date: date.toISOString() });
      if (response.data && response.data.date) {
        return new Date(response.data.date);
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw new Error('Error adding date');
    }
  };