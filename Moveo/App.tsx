import React from 'react';
import { PaperProvider } from 'react-native-paper';
import LoginScreen from './src/app';
import theme from './src/theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <LoginScreen />
    </PaperProvider>
  );
}

