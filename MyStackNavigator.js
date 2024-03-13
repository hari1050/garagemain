import { createStackNavigator } from '@react-navigation/stack';
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
import summerService from './components/summerService';
import winterService from './components/winterService';
import monsoonService from './components/monsoonService';
import Emergency from './components/Emergency';

const Stack = createStackNavigator();

function MyStackNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splashScreen" component={splashScreen}/>
        <Stack.Screen name="phoneNoAuth" component={mobileAuth}/>
        <Stack.Screen name="otpverifyScreen" component={otpverifyScreen}/>
        <Stack.Screen name="nameAndCarDetails" component={nameAndCarDetails}/>
        <Stack.Screen name="homeScreen" component={homeScreen}/>
        <Stack.Screen name="classicService" component={classicService}/>
        <Stack.Screen name="summerService" component={summerService}/>
        <Stack.Screen name="monsoonService" component={monsoonService}/>
        <Stack.Screen name="winterService" component={winterService}/>
        <Stack.Screen name="userCompleteDetails" component={userCompleteDetails}/>
        <Stack.Screen name="bookingConfirmation" component={bookingConfirmation}/>
        <Stack.Screen name="userProfile" component={userProfile}/>
        <Stack.Screen name="editProfile" component={editProfile}/>
        <Stack.Screen name="Emergency" component={Emergency}/>
      </Stack.Navigator>
  );
}

export default MyStackNavigator;