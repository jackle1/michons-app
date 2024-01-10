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
        <Tab.Screen 
          name="Countdown" 
          component={CountdownTimerScreen}
          options={{ unmountOnBlur: true }}  // This will unmount the screen when it's not focused
        />
        <Tab.Screen 
          name="Dates" 
          component={DatesScreen}
          options={{ unmountOnBlur: true }}  // This will unmount the screen when it's not focused
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;