import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface DateItemProps {
  date: Date;
  onDelete: (date: Date) => void;
}

const DateItem: React.FC<DateItemProps> = ({ date, onDelete }) => {
  return (
    <View style={styles.dateItem}>
      <Text>{date.toString()}</Text>
      <Button title="Delete" onPress={() => onDelete(date)} />
    </View>
  );
};

const styles = StyleSheet.create({
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
});

export default DateItem;