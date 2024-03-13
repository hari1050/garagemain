import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyStackNavigator from './MyStackNavigator';

export default function App() {

  return (
    <NavigationContainer>
      <MyStackNavigator/>
    </NavigationContainer>
  );

}
