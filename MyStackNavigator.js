import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import splashScreen from './components/splashScreen';
import mobileAuth from './components/mobileAuth';
import otpverifyScreen from './components/otpverifyScreen';
import Nameentry from './components/Nameentry';
import Carmodelentry from './components/Carmodelentry';
import Customloadingicon from './components/Customloadingicon';
import homeScreen from './components/homeScreen';
import classicService from './components/classicService';
import userCompleteDetails from './components/userCompleteDetails';
import bookingConfirmation from './components/bookingConfirmation';
import Bookingmap from './components/Bookingmap';
import userProfile from './components/userProfile';
import editProfile from './components/editProfile';
import Servicehistory from './components/Servicehistory';
import summerService from './components/summerService';
import winterService from './components/winterService';
import monsoonService from './components/monsoonService';
import Emergency from './components/Emergency';
import otherServices from './components/otherServices';
import AboutUs from './components/AboutUs';
import Terms from './components/Terms';
import Clutch from './components/Clutch';
import Engine from './components/Engine';
import Suspension from './components/Suspension';
import Painting from './components/Painting';

const Stack = createStackNavigator();

function MyStackNavigator() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        if (userData && 'name' in userData && 'carModels' in userData) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Set loading to false after checking AsyncStorage
      }
    };

    checkUserData();
 }, []);

 if (isLoading) {
    return <Customloadingicon />; // Assuming you have a loading screen component
 }
  

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? 'homeScreen' : 'splashScreen'}>
        <Stack.Screen name="splashScreen" component={splashScreen}/>
        <Stack.Screen name="Customloadingicon" component={Customloadingicon}/>
        <Stack.Screen name="phoneNoAuth" component={mobileAuth}/>
        <Stack.Screen name="otpverifyScreen" component={otpverifyScreen}/>
        <Stack.Screen name="Nameentry" component={Nameentry}/>
        <Stack.Screen name="Carmodelentry" component={Carmodelentry}/>
        <Stack.Screen name="homeScreen" component={homeScreen}/>
        <Stack.Screen name="otherServices" component={otherServices}/>
        <Stack.Screen name="classicService" component={classicService}/>
        <Stack.Screen name="summerService" component={summerService}/>
        <Stack.Screen name="monsoonService" component={monsoonService}/>
        <Stack.Screen name="winterService" component={winterService}/>
        <Stack.Screen name="userCompleteDetails" component={userCompleteDetails}/>
        <Stack.Screen name="bookingConfirmation" component={bookingConfirmation}/>
        <Stack.Screen name="Bookingmap" component={Bookingmap}/>
        <Stack.Screen name="userProfile" component={userProfile}/>
        <Stack.Screen name="editProfile" component={editProfile}/>
        <Stack.Screen name="Servicehistory" component={Servicehistory}/>
        <Stack.Screen name="Emergency" component={Emergency}/>
        <Stack.Screen name="AboutUs" component={AboutUs}/>
        <Stack.Screen name="Terms" component={Terms}/>
        <Stack.Screen name="Clutch" component={Clutch}/>
        <Stack.Screen name="Painting" component={Painting}/>
        <Stack.Screen name="Suspension" component={Suspension}/>
        <Stack.Screen name="Engine" component={Engine}/>
      </Stack.Navigator>
  );
}

export default MyStackNavigator;