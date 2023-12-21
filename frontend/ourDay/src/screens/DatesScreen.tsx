import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Button, TextInput, Alert } from 'react-native';
import DateItem from '../components/DateItem';
import { fetchDates, deleteDate, addDate } from '../utils/api'; // Update with addDate function

const DatesScreen: React.FC = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [newDate, setNewDate] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const datesFromAPI = await fetchDates();
      setDates(datesFromAPI);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const handleDelete = async (date: Date) => {
    try {
      await deleteDate(date);
      setDates(dates.filter(item => item !== date));
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const handleAddDate = async () => {
    try {
      const addedDate = await addDate(new Date(newDate));
      setDates([...dates, addedDate]);
      setNewDate(''); // Clear the input field after adding
    } catch (error) {
      Alert.alert('Error', 'Failed to add date. Please try again.');
      console.error('Error adding date:', error);
    }
  };

  const renderDateItem = ({ item }: { item: Date }) => (
    <DateItem date={item} onDelete={handleDelete} />
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={newDate}
        onChangeText={text => setNewDate(text)}
      />
      <Button title="Add Date" onPress={handleAddDate} />
      <FlatList
        data={dates}
        renderItem={renderDateItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
  });
  
export default DatesScreen;
