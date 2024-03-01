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
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen}/>
      <Stack.Screen name="MainScreen" component={MainScreen}/>
      <Stack.Screen name="ServiceDetails" component={ServiceDetails}/>
      <Stack.Screen name="DetailsEntryScreen" component={DetailsEntryScreen}/>

    </Stack.Navigator>
  );
}

export default MyStackNavigator;