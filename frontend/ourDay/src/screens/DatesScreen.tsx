import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Button, Alert, Text, TouchableOpacity, Animated, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateItem from '../components/DateItem';
import { fetchDates, deleteDate, addDate } from '../utils/api';
import { IDate } from '../utils/types';
import { useDates } from '../context/DatesContext';

const DatesScreen: React.FC = () => {
  const { dates, setDates, isLoading } = useDates();
  const [newDate, setNewDate] = useState(new Date());
  const [newName, setNewName] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current; // The scale of the date picker

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

  const handleDelete = async (id: string) => {
    try {
      await deleteDate(id);
      setDates(dates.filter(date => date._id !== id));
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const handleAddDate = async () => {
    try {
      const currentDate = new Date();

      if (newDate <= currentDate) {
        Alert.alert('That date has already passed silly...');
        return;
      }
      
      const name = newName.trim() || "Michon and Jack's Day <3";
      const addedDate = await addDate(newDate, name);
      await fetchData();
      togglePicker(false); // Hide picker after date is added
      setNewName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add date. Please try again.');
      console.error('Error adding date:', error);
    }
  };

  const togglePicker = (show: boolean) => {
    if (show) {
      setShowPicker(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setShowPicker(false);
      });
    }
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || newDate;
    setNewDate(currentDate);
  };

  const now = new Date();

  const upcomingDates = dates.filter(dateObj => new Date(dateObj.date) > now);
  upcomingDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const renderDateItem = ({ item }: { item: IDate }) => {
    return <DateItem date={item.date} name={item.name} onDelete={() => handleDelete(item._id)} />;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Add Date" onPress={() => togglePicker(true)} />
      {showPicker && (
        <>
          <BlurView
            style={styles.absolute}
            intensity={50}
            tint="dark"
          />
          <Animated.View style={[styles.pickerContainer, { transform: [{ scale: scaleAnim }], opacity: scaleAnim }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => togglePicker(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.nameInput}
              placeholder="What's our date called?"
              value={newName}
              onChangeText={setNewName}
            />
            <DateTimePicker
              value={newDate}
              mode="datetime" // Allows selection of both date and time
              display="spinner"
              onChange={onChange}
            />
            <Button title="Add Date" onPress={handleAddDate} />
          </Animated.View>
        </>
      )}
      {dates.length > 0 ? (
        <FlatList
          data={upcomingDates}
          renderItem={renderDateItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.emptyMessage}>It's so empty here...</Text>
      )}
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
  pickerContainer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 25,
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'lightgrey',
    borderRadius: 15,
    padding: 8,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  emptyMessage: {
    marginTop: 20,
    fontSize: 18,
    color: 'grey',
  },
  nameInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%', // Adjust as needed
  },
});

export default DatesScreen;