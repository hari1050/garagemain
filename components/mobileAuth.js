import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

export default function mobileAuth() {

    const navigation = useNavigation();
    const [phonenumber, setPhoneNumber] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    

    // const sendOtp = async (phoneNumber, apiKey, senderName, message) => {
    //   const apiUrl = `https://api.textlocal.in/send/?apikey=${apiKey}&numbers=${phoneNumber}&message=${encodeURIComponent(message)}&sender=${senderName}`;
    
    //   try {
    //     const response = await axios.get(apiUrl);
    //     console.log(response.data);
    //     // Handle success
    //   } catch (error) {
    //     console.error(error);
    //     // Handle error
    //   }
    // };

    const handlePhone = () => {
      if (phonenumber.length === 10) {
        // const apiKey = 'NTE2MjRhMzU2NDUyNDU0ODQ3NDg1NzUyNTY2MzRmNmM='; // Replace with your Textlocal API Key
        // const senderName = '600010'; // Replace with your sender name
        // const message = 'Hi there, thank you for sending your first test message from Textlocal. See how you can send effective SMS campaigns here: https://tx.gl/r/2nGVj/'; // Replace with your message
        // sendOtp(phonenumber, apiKey, senderName, message);
        navigation.navigate('otpverifyScreen', { phonenumber: phonenumber });
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
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
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