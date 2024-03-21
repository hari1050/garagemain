import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyStackNavigator from './MyStackNavigator';
import {useFonts} from 'expo-font';


export default function App() {

  const [fontsLoaded] = useFonts({
    'Satoshi-Regular': require('./assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Bold': require('./assets/fonts/Satoshi-Bold.otf'),
    'Satoshi-Black': require('./assets/fonts/Satoshi-Black.otf'),
    'Satoshi-BlackItalic': require('./assets/fonts/Satoshi-BlackItalic.otf'),
    'Satoshi-BoldItalic': require('./assets/fonts/Satoshi-BoldItalic.otf'),
    'Satoshi-Italic': require('./assets/fonts/Satoshi-Italic.otf'),
    'Satoshi-Medium': require('./assets/fonts/Satoshi-Medium.otf'),
    'Satoshi-Light': require('./assets/fonts/Satoshi-Light.otf'),
    'Satoshi-LightItalic': require('./assets/fonts/Satoshi-LightItalic.otf'),
    'Satoshi-MediumItalic': require('./assets/fonts/Satoshi-MediumItalic.otf'),
  });

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
