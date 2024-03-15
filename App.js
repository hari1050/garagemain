import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyStackNavigator from './MyStackNavigator';

export default function App() {

  return (
    <>
    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    <NavigationContainer>
      <MyStackNavigator/>
    </NavigationContainer>
    </>
  );

}
