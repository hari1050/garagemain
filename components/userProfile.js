import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabaseConfig';

export default function userProfile() {

    const navigation = useNavigation();
    const route = useRoute();
    const {name, phonenumber} = route.params;

    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          navigation.navigate('homeScreen');
          return true; // Prevent default back button behavior
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
      }, [navigation, name])
   );

    const navigateToHome = () => {
        navigation.navigate('homeScreen');
    }

    const navigateToEditProfile = () => {
        navigation.navigate('editProfile');
    }

    const navigateToMyBookings = () => {
      navigation.navigate('Servicehistory', {name:name, phonenumber:phonenumber});
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


    return (
      <View style={styles.viewContainer}>

      <ScrollView style={styles.container}>
         <TouchableOpacity style={styles.caretLeft} onPress={navigateToHome}>
          <CaretLeft></CaretLeft>
         </TouchableOpacity>
        <View style={styles.header}>
            <Text style={styles.headerText}>Hi {name}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={navigateToEditProfile}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={navigateToMyBookings}>
                  <Text style={styles.buttonText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.buttonText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.buttonText}>Contact Us</Text>
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
    flex: 1,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#732753',
    textAlign: 'left',
  },
  buttonText: {
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
    backgroundColor: '#9B0E0E', 
    height: 54,
    width:'94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 12,
    alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
  },
  logoutText:{
    color: '#fff',
    fontSize: 18,
  },
});