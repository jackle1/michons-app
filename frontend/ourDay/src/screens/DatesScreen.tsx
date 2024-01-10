import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Button, Alert, Text, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateItem from '../components/DateItem';
import { fetchDates, deleteDate, addDate } from '../utils/api';

const DatesScreen: React.FC = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [newDate, setNewDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current; // The scale of the date picker

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const datesFromAPI = await fetchDates();
      console.log(datesFromAPI)
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
      const addedDate = await addDate(newDate);
      setDates([...dates, addedDate]);
      togglePicker(false); // Hide picker after date is added
    } catch (error) {
      Alert.alert('Error', 'Failed to add date. Please try again.');
      console.error('Error adding date:', error);
    }
  };

  const togglePicker = (show) => {
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

  const upcomingDates = dates.filter(date => date > now);
  upcomingDates.sort((a, b) => a.getTime() - b.getTime());

  const renderDateItem = ({ item }: { item: Date }) => (
    <DateItem date={item} onDelete={handleDelete} />
  );

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
      <FlatList
        data={upcomingDates}
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
});

export default DatesScreen;