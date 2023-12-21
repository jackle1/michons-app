import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CountdownTimerScreen: React.FC = () => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    // Set the target date for the countdown (for demonstration purposes, set 7 days from now)
    const currentDate = new Date();
    const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    setTargetDate(nextWeek);
  }, []);

  const calculateTimeLeft = () => {
    if (targetDate) {
      const difference = targetDate.getTime() - new Date().getTime();
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Countdown Timer</Text>
      {targetDate ? (
        <View>
          <Text>Days: {timeLeft.days}</Text>
          <Text>Hours: {timeLeft.hours}</Text>
          <Text>Minutes: {timeLeft.minutes}</Text>
          <Text>Seconds: {timeLeft.seconds}</Text>
        </View>
      ) : (
        <Text>Loading...</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CountdownTimerScreen;