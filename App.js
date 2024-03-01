import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyStackNavigator from './MyStackNavigator';

export default function App() {

  return (
    <NavigationContainer>
      <MyStackNavigator/>
    </NavigationContainer>
  );

}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
