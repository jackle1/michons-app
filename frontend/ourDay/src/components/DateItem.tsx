import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateItemProps {
  date: Date;
  onDelete: (date: Date) => void;
}

const DateItem: React.FC<DateItemProps> = ({ date, onDelete }) => {
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
      <Text>{formattedDate}</Text>
      <TouchableOpacity onPress={() => onDelete(date)}>
        <Ionicons name="trash-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
});

export default DateItem;