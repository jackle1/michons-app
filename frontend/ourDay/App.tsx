import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { DatesProvider } from './src/context/DatesContext';

const App: React.FC = () => {
  return (
    <DatesProvider>
      <AppNavigator />
    </DatesProvider>
  );
};

export default App;