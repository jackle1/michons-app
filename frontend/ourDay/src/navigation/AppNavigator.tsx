import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CountdownTimerScreen from '../screens/CountdownTimerScreen';
import DatesScreen from '../screens/DatesScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Countdown" component={CountdownTimerScreen} />
        <Tab.Screen name="Dates" component={DatesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;