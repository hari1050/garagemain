import React from 'react';
import { createNativeStackNavigator, TransitionPresets } from '@react-navigation/native-stack';
import homeScreen from './components/homeScreen';
import Emergency from './components/Emergency'; 
import userProfile from './components/userProfile';

const Stack = createNativeStackNavigator();

const TabStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false , animation: 'slide_from_right' }}>
      <Stack.Screen name="homeScreen" component={homeScreen} />
      <Stack.Screen name="Emergency" component={Emergency} />
      <Stack.Screen name="userProfile" component={userProfile} />
    </Stack.Navigator>
  );
};

export default TabStackNavigator;
