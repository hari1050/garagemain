import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';

export default function mobileAuth() {

    const navigation = useNavigation();
    const [otpNumber, setOtpNumber] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const route = useRoute();
    const { phoneNumber } = route.params;
    
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

    const handleOtp = () => {
      if(otpNumber.length === 4){
        navigation.navigate('nameAndCarDetails');
      }
    };

    const handleResend = () => {
      // Navigate to the other screen (replace 'OtherScreen' with your screen name)
      navigation.navigate('phoneNoAuth');
    };

    const handleContinue = () => {
      if (agreeToTerms) {
        // Handle the continue action, e.g., navigate to the next screen or make an API call
        console.log('Phone number:', phoneNumber);
      } else {
        // Handle the case where terms are not agreed to
        alert('Please agree to the terms of use and privacy notice.');
      }
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.caretLeft} onPress={handleResend}>
            <CaretLeft/>
        </TouchableOpacity>
        <Text style={styles.headerText}>What's the code</Text>
        <Text style={styles.subHeaderText}>
          4 digit code has been sent to {phoneNumber}
        </Text>
        
        <TextInput
          style={styles.input}
          onChangeText={setOtpNumber}
          value={otpNumber}
          placeholder="OTP"
          keyboardType="phone-pad"
        />
        <TouchableOpacity onPress={handleResend}>
        <Text style={[styles.subHeaderText, styles.resendLink]}>Didn't Receive OTP? Resend</Text>
      </TouchableOpacity>
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
            <TouchableOpacity style={[styles.customButton, otpNumber.length === 4 ? {} : styles.disabledButton]} onPress={handleOtp}>
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
      backgroundColor: '#fff',
    },
    caretLeft: {
      marginTop:0,
      marginBottom:20,
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
      position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts
    },
    resendLink: {
      color: '#732753', // Specify the color for the link
      textDecorationLine: 'underline', // Underline the link
    },
});