import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CountdownTimerScreen from '../screens/CountdownTimerScreen';
import DatesScreen from '../screens/DatesScreen';
import { DatesProvider } from '../context/DatesContext';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <DatesProvider>
        <Tab.Navigator>
          <Tab.Screen 
            name="Countdown" 
            component={CountdownTimerScreen}
            options={{ unmountOnBlur: false }}  // This will unmount the screen when it's not focused
          />
          <Tab.Screen 
            name="Dates" 
            component={DatesScreen}
            options={{ unmountOnBlur: true }}  // This will unmount the screen when it's not focused
          />
        </Tab.Navigator>
      </DatesProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;