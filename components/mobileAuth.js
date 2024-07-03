import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';

export default function mobileAuth() {

    const navigation = useNavigation();
    const [phonenumber, setPhoneNumber] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    let OTP = 1;

    const sendOTP = async (phoneNumber, otp) => {
      const username = 'DG35-classiccar';
      const password = 'digimile';
      const type = '0';
      const dlr = '1';
      const source = 'CLSCAR';
      const message = `Dear Customer, Your OTP for login on CLASSIC CAR CARE app is ${otp} and do not share it with anyone. Thank you.`;
      const entityid = '1701171828107767374';
      const tempid = '1707171932098937701';
    
      const url = `https://rslri.connectbind.com:8443/bulksms/bulksms?username=${username}&password=${password}&type=${type}&dlr=${dlr}&destination=${phoneNumber}&source=${source}&message=${encodeURIComponent(message)}&entityid=${entityid}&tempid=${tempid}`;
      try {
        const response = await axios.get(url);
        console.log('SMS Sent', response.data);
      } catch (error) {
        console.error('Error sending SMS', error);
      }
    };

    const generateOTP = () => {
        return Math.floor(1000*Math.random()*9000).toString().slice(0,4);
    }

    const handlePhone = () => {
      if (phonenumber.length === 10) {
        OTP = generateOTP();
        console.log(OTP);
        sendOTP(phonenumber,OTP);
        navigation.navigate('otpverifyScreen', { phonenumber: phonenumber, OTP: OTP });
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
      <View style={styles.viewContainer}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}>
        <Text style={styles.headerText}>We need your phone number</Text>
        <Text style={styles.subHeaderText}>
          We’ll text you a code to verify your phone
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
        </ScrollView>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.customButton, phonenumber.length === 10 ? {} : styles.disabledButton]} onPress={handlePhone}>
              <Text style={styles.buttonText}>Continue</Text>
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
    buttonContainer:{
      flex: 1,
      justifyContent: 'flex-end', // Centers children vertically in the container
      alignItems: 'center', 
    },
    headerText: {
      fontFamily:'Satoshi-Bold',
      fontSize: 22,
      color: '#732753',
      textAlign: 'left',
    },
    subHeaderText: {
      fontFamily:'Satoshi-Medium',
      fontSize: 16,
      color: '#000', 
      marginTop: 10,
      textAlign: 'left',
    },
    input: {
      fontFamily: 'Satoshi-Medium',
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
      fontFamily: 'Satoshi-Medium',
      color: '#fff',
      fontSize: 18,
    },
    customButton: {
      alignSelf:'center',
      backgroundColor: '#2C152A', // Specify your color
      height: 54,
      width: '94%',
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadows
      shadowOffset: { width: 0, height: 4 }, // iOS shadows
      shadowOpacity: 0.25, // iOS shadows
      shadowRadius: 6, // iOS shadows
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: '5%',
    },
    disabledButton: {
      alignSelf:'center',
      backgroundColor: '#646464', // Specify your color
      height: 54,
      width: '94%',
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadows
      shadowOffset: { width: 0, height: 4 }, // iOS shadows
      shadowOpacity: 0.25, // iOS shadows
      shadowRadius: 6, // iOS shadows
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: '5%'

    }
});