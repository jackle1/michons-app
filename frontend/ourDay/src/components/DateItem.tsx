import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateItemProps {
  date: Date;
  name: string;
  onDelete: (date: Date) => void;
}

const DateItem: React.FC<DateItemProps> = ({ date, name, onDelete }) => {
  let formattedDate;
  try {
    formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Invalid date:', date);
    formattedDate = 'Invalid date';
  }

  return (
    <View style={styles.dateItem}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(date)}>
        <Ionicons name="trash-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  dateItem: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: 'center',
    paddingHorizontal: 10,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  nameContainer: {
    flex: 1,
    marginRight: 20,
  },
  deleteButton: {
    marginLeft: 20, // Add margin to the delete button
  },
});

export default DateItem;