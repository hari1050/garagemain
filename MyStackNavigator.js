import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './components/SignUpScreen';
import LoginScreen from './components/LoginScreen';
import DetailsEntryScreen from './components/DetailsEntryScreen';
import MainScreen from './components/MainScreen';
import ServiceDetails from './components/ServiceDetails';
import splashScreen from './components/splashScreen';
import mobileAuth from './components/mobileAuth';
import otpverifyScreen from './components/otpverifyScreen';
import nameAndCarDetails from './components/nameAndCarDetails';
import homeScreen from './components/homeScreen';
import classicService from './components/classicService';
import userCompleteDetails from './components/userCompleteDetails';
import bookingConfirmation from './components/bookingConfirmation';
import userProfile from './components/userProfile';
import editProfile from './components/editProfile';

const Stack = createStackNavigator();

function MyStackNavigator() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="splashScreen" component={splashScreen}/>
        <Stack.Screen name="phoneNoAuth" component={mobileAuth}/>
        <Stack.Screen name="otpverifyScreen" component={otpverifyScreen}/>
        <Stack.Screen name="nameAndCarDetails" component={nameAndCarDetails}/>
        <Stack.Screen name="homeScreen" component={homeScreen}/>
        <Stack.Screen name="classicService" component={classicService}/>
        <Stack.Screen name="userCompleteDetails" component={userCompleteDetails}/>
        <Stack.Screen name="bookingConfirmation" component={bookingConfirmation}/>
        <Stack.Screen name="userProfile" component={userProfile}/>
        <Stack.Screen name="editProfile" component={editProfile}/>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen name="MainScreen" component={MainScreen}/>
        <Stack.Screen name="ServiceDetails" component={ServiceDetails}/>
        <Stack.Screen name="DetailsEntryScreen" component={DetailsEntryScreen}/>
      </Stack.Navigator>
  );
}

export default MyStackNavigator;