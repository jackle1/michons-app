import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useDates } from '../context/DatesContext';
import { IDate } from '../utils/types';
import ConfettiCannon from 'react-native-confetti-cannon';

const CountdownTimerScreen: React.FC = () => {
  const { dates, isLoading } = useDates();
  const [targetDate, setTargetDate] = useState<IDate | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: '- ', hours: '- ', minutes: '- ', seconds: '- ' });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchDatesAndUpdateCountdown = async () => {
      try {
        const now = new Date();
        const futureDates = dates
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
    };
    
    fetchDatesAndUpdateCountdown();
  }, [dates]);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = targetDate.date.getTime() - new Date().getTime();

      //HERE TEMPORARYILY UNTIL COUNTDOWN REACH 9 IS IMPLEMENTED
      if (difference <= 0) {
        return { days: "0", hours: "0", minutes: "0", seconds: "0" };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString(),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString(),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString(),
        seconds: Math.floor((difference % (1000 * 60)) / 1000).toString(),
      };
    };

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (parseInt(timeLeft.days, 10) === 0 && 
        parseInt(timeLeft.hours, 10) === 0 && 
        parseInt(timeLeft.minutes, 10) === 0 && 
        parseInt(timeLeft.seconds, 10) === 0) {
      setShowConfetti(true);
    }

    return () => clearTimeout(timer);
  }, [targetDate, timeLeft]);

  //blank screen when loading
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
      {showConfetti && (
        <ConfettiCannon
          count={200} // Adjust as needed
          origin={{ x: -10, y: 0 }} // Adjust as needed
          explosionSpeed={400} // Adjust as needed
          fadeOut
        />
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