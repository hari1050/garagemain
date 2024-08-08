import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import Customloadingicon from './Customloadingicon';
import { useFocusEffect ,useIsFocused} from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabaseConfig';

export default function userProfile() {

    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const [name, setName] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Track if data is currently being loaded


   useEffect(() => {
    if (isFocused) {
        const initializeUserData = async () => {
            setIsLoading(true); // Start loading
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);
                    setName(userData.name);
                    setPhoneNumber(userData.phonenumber);
                }
            } catch (error) {
                console.log("Error retrieving user data from AsyncStorage:", error);
            }
            setIsLoading(false); // End loading
        };

        initializeUserData();
    }
}, [isFocused]); // Add userDataLoaded as a dependency

    // const navigateToHome = () => {
    //     navigation.navigate('homeScreen');
    // }

    const navigateToEditProfile = () => {
        navigation.navigate('editProfile');
    }

    const navigateToMyBookings = () => {
      navigation.navigate('Servicehistory', {name:name, phonenumber:phonenumber});
  }

    const navigateToAboutUs = () => {
      navigation.navigate('AboutUs',{name:name});
    }

    const navigateToTerms = () => {
      navigation.navigate('Terms');
    }

    const navigatelogout = async () => {
      try {
        // Remove userData from AsyncStorage
        await AsyncStorage.removeItem('userData');
        console.log('UserData deleted successfully.');
        // Navigate to the splashScreen
        navigation.navigate('splashScreen');
    } catch (error) {
        console.error('Error removing userData from AsyncStorage:', error);
    }
    }

    if (isLoading) {
      return <Customloadingicon />;
  }


    return (
      <View style={styles.viewContainer}>

      <ScrollView style={styles.container}>
         {/* <TouchableOpacity style={styles.caretLeft} onPress={navigateToHome}>
          <CaretLeft></CaretLeft>
         </TouchableOpacity> */}
        <View style={styles.header}>
            <Text style={styles.headerText}>Hi {name}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={navigateToEditProfile}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={navigateToMyBookings}>
                  <Text style={styles.buttonText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress = {navigateToAboutUs}>
                  <Text style={styles.buttonText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress = {navigateToTerms}>
                  <Text style={styles.buttonText}>Terms And Conditions</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      <View>
          <TouchableOpacity style={styles.logout} onPress={navigatelogout}>
              <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    position: 'relative',

  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  caretLeft: {
      marginTop:0,
      marginBottom:20,
  },
  header: {
      paddingBottom:10,
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap:20,
      alignItems: 'left',
      paddingBottom: 40,
  },
  buttonContainer:{
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center', 
  },
  headerText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 22,
    color: '#732753',
    textAlign: 'left',
    paddingBottom: 20
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    color: '#2C152A',
    fontSize: 18,
  },
  carModel: {
    paddingTop:8,
    paddingBottom:8,
  },
  secondaryButton: {
    borderWidth:1,
    borderColor:'#2C152A',
    backgroundColor: '#fff', 
    borderColor:'#2C152A',
    height: 57,
    width:'94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    // paddingTop: 16,
    // paddingBottom: 16,
    alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    borderWidth:1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#9B0E0E', 
    height: 54,
    width:'94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    // paddingTop: 16,
    // paddingBottom: 12,
    alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '10%',
  },
  logoutText:{
    fontFamily: 'Satoshi-Medium',
    color: '#fff',
    fontSize: 18,
  },
});