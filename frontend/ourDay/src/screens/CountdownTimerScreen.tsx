import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fetchDates } from '../utils/api';
import { IDate } from '../utils/types';

const CountdownTimerScreen: React.FC = () => {
  const [targetDate, setTargetDate] = useState<IDate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchDatesAndUpdateCountdown = async () => {
      try {
        const upcomingDates = await fetchDates();
        const now = new Date();
        const futureDates = upcomingDates
          .filter(dateObj => new Date(dateObj.date) > now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const targetDateItem = {
          date: futureDates[0].date,
          _id: futureDates[0]._id,
          name: futureDates[0].name,
        };
        setTargetDate(targetDateItem);
      } catch (error) {
        console.error("Fetch and Update Error");
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchDatesAndUpdateCountdown();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = targetDate.date.getTime() - new Date().getTime();
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

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const timeUntilNextDay = tomorrow.getTime() - now.getTime();

  useEffect(() => {
    // Check if the timer has reached zero
    const isTimerZero = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    // Show confetti when timer hits zero
    if (isTimerZero) {
      setShowConfetti(true);
    }

    // Reset confetti and timer when the next day begins
    const resetConfetti = setTimeout(() => {
      setShowConfetti(false);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }, timeUntilNextDay);

    return () => clearTimeout(resetConfetti);
  }, [timeLeft, timeUntilNextDay]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* <Text>Loading Timer...</Text> */}
      </View>
    );
  }

  const countdownTimer = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{targetDate?.name}</Text>
      {targetDate && !isLoading ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdownTimer}</Text>
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
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
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CountdownTimerScreen;