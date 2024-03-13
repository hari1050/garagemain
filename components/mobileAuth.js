import React, { useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// import auth from '@react-native-firebase/auth';
import { auth } from '../firebaseConfig';
import CheckBox from '@react-native-community/checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function mobileAuth() {

    const navigation = useNavigation();
    const [phonenumber, setPhoneNumber] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    
    // const sendOtp = async () => {
    //     const fullPhoneNumber = '+91' + phoneNumber;
    //     try {
    //         const recaptcha = new RecaptchaVerifier(auth,"recaptcha",{})
    //         const confirmation = await signInWithPhoneNumber(auth,phoneNumber,recaptcha)
    //         console.log(confirmation);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const handlePhone = () => {
      if(phonenumber.length === 10){
        navigation.navigate('otpverifyScreen',{ phonenumber: phonenumber });
      }
    };

    const handlePhoneChange = (text) => {
      // Allow only numbers
      const numericValue = text.replace(/[^0-9]/g, "");
      // Limit input to 10 numbers
      if (numericValue.length <= 10) {
          setPhoneNumber(numericValue || ''); // Ensure it's never null
      }
  };
  

    const handleContinue = () => {
      if (agreeToTerms) {
        // Handle the continue action, e.g., navigate to the next screen or make an API call
        console.log('Phone number:', phonenumber);
      } else {
        // Handle the case where terms are not agreed to
        alert('Please agree to the terms of use and privacy notice.');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>We need your phone number</Text>
        <Text style={styles.subHeaderText}>
          we’ll text you a code to verify your phone
        </Text>
        
        <TextInput
          style={styles.input}
          onChangeText={handlePhoneChange}
          value={phonenumber}
          maxLength={10} // Limits the input to 10 characters
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        <View id='recaptcha'/>
        {/* <View style={styles.termsContainer}>
          <CheckBox
            value={agreeToTerms}
            onValueChange={setAgreeToTerms}
            style={styles.checkbox}
          />
          <Text style={styles.termsText}>
            By selecting “I Agree”, I have reviewed and agree to the Terms of Use and acknowledge the Privacy Notice. I am at least 18 years of age
          </Text>
        </View> */}
  
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.customButton, phonenumber.length === 10 ? {} : styles.disabledButton]} onPress={handlePhone}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 60,
      backgroundColor: '#fff',
    },
    buttonContainer:{
      flex: 1,
      justifyContent: 'flex-end', // Centers children vertically in the container
      alignItems: 'center', 
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#732753',
      textAlign: 'left',
    },
    subHeaderText: {
      fontSize: 16,
      color: '#000', 
      marginTop: 10,
      textAlign: 'left',
    },
    input: {
      marginTop: 30,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
    },
    termsContainer: {
      flexDirection: 'row',
      marginTop: 30,
      alignItems: 'center',
    },
    checkbox: {
      marginRight: 10,
    },
    termsText: {
      flex: 1,
      fontSize: 14,
    },
    button: {
      backgroundColor: '#800080', // Purple color
      borderRadius: 5,
      padding: 15,
      marginTop: 30,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    customButton: {
      backgroundColor: '#2C152A', // Specify your color
      height: 54,
      width: 350,
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadows
      shadowOffset: { width: 0, height: 4 }, // iOS shadows
      shadowOpacity: 0.25, // iOS shadows
      shadowRadius: 6, // iOS shadows
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 16,
      paddingBottom: 16,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts.
    },
    disabledButton: {
      backgroundColor: '#646464', // Specify your color
      height: 54,
      width: 350,
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadows
      shadowOffset: { width: 0, height: 4 }, // iOS shadows
      shadowOpacity: 0.25, // iOS shadows
      shadowRadius: 6, // iOS shadows
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 16,
      paddingBottom: 16,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts.

    }
});