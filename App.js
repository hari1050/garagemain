import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyStackNavigator from './MyStackNavigator';

export default function App() {

  return (
    <>
    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <MyStackNavigator/>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );

}
