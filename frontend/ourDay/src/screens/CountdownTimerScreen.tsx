import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fetchDates } from '../utils/api';

const CountdownTimerScreen: React.FC = () => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: null, hours: null, minutes: null, seconds: null });

  useEffect(() => {
    const fetchDatesAndUpdateCountdown = async () => {
      setIsLoading(true);
      try {
        const upcomingDates = await fetchDates();
        const now = new Date();
        const futureDates = upcomingDates.filter(date => date > now);
        const nextDate = futureDates.length > 0 ? futureDates.sort()[0] : null;
        setTargetDate(nextDate);
      } catch (error) {
        console.error("Fetch and Update Error");
      }
      setIsLoading(false);
    };

    fetchDatesAndUpdateCountdown();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetDate, timeLeft]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading Timer...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Countdown Timer</Text>
      {targetDate && !isLoading ? (
        <View>
          <Text>Days: {timeLeft.days}</Text>
          <Text>Hours: {timeLeft.hours}</Text>
          <Text>Minutes: {timeLeft.minutes}</Text>
          <Text>Seconds: {timeLeft.seconds}</Text>
          <View style={styles.gifContainer}>
            <Image
            source={require('../../pictures/bubuwaiting.gif')}
            style={styles.gif}
            />
          </View>
        </View>
        
      ) : (
        <View style={styles.noDatesView}>
          <Text style={styles.noDatesText}>No dates planned yet :(</Text>
          <Image
            source={require('../../pictures/dudububusad.gif')}
            style={styles.gif}
          />
        </View>
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
  noDatesView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDatesText: {
    fontSize: 20,
    color: 'grey',
    marginBottom: 20,
  },
  gif: {
    width: 200, 
    height: 200,  
    paddingTop: 10
  },
  gifContainer: {
    paddingTop: 60,
  },
});

export default CountdownTimerScreen;