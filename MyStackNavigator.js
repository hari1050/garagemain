import { createStackNavigator } from '@react-navigation/stack';
import splashScreen from './components/splashScreen';
import mobileAuth from './components/mobileAuth';
import otpverifyScreen from './components/otpverifyScreen';
import Nameentry from './components/Nameentry';
import Carmodelentry from './components/Carmodelentry';
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

const Stack = createStackNavigator();

function MyStackNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splashScreen" component={splashScreen}/>
        <Stack.Screen name="phoneNoAuth" component={mobileAuth}/>
        <Stack.Screen name="otpverifyScreen" component={otpverifyScreen}/>
        <Stack.Screen name="Nameentry" component={Nameentry}/>
        <Stack.Screen name="Carmodelentry" component={Carmodelentry}/>
        <Stack.Screen name="homeScreen" component={homeScreen}/>
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
      </Stack.Navigator>
  );
}

export default MyStackNavigator;