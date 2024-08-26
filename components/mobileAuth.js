import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import supabase from '../supabaseConfig';
import { ScrollView } from 'react-native-gesture-handler';
import { sendOTPToPhoneNumber } from '../otpConfig';

export default function mobileAuth() {

    const navigation = useNavigation();
    const [phonenumber, setPhoneNumber] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testingPhNo, setTestingPhNo] = useState();
    const [testingOtp, setTestingOtp] = useState();

    useEffect(() => {
      // Fetch the modal data from Supabase
      const fetchModalData = async () => {
          const { data, error } = await supabase
              .from('feature_flags')
              .select('*')
              .eq('id', 3) // Assuming you're fetching a specific row, adjust the query as needed
  
          if (error) {
              console.error(error);
          } else {
              if (data.length > 0) {
                  const modalData = data[0];
                  setIsTesting(modalData.is_visible);
                  setTestingPhNo(modalData.t_ph_no);
                  setTestingOtp(modalData.t_otp)
              }
          }
      };
  
      fetchModalData();
    }, []);

    const handlePhone = async () => {
      if(isTesting && phonenumber === testingPhNo.toString()){
        navigation.navigate('otpverifyScreen', { phonenumber: phonenumber, OTP: testingOtp, isTesting: isTesting});
      }
      else if (phonenumber.length === 10 && agreeToTerms) {
        const OTP = await sendOTPToPhoneNumber(phonenumber);
        navigation.navigate('otpverifyScreen', { phonenumber: phonenumber, OTP: OTP });
      }
      else if(!agreeToTerms){
        alert('Please agree to the terms of use and privacy notice.');
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
  
    const handleValueChange = (newValue) => {
      setAgreeToTerms(newValue); // Updates state based on checkbox value
    };

    const navigateToTermsPage = () => {
      navigation.navigate('Terms'); // Replace 'TermsPage' with your actual route name
    };
  
    return (
      <View style={styles.viewContainer}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}>
        <Text style={styles.headerText}>Please enter your phone number</Text>
        <Text style={styles.subHeaderText}>
          We’ll text you a code to verify your phone
        </Text>
        
        <View style={styles.codeContainer}>
        <TextInput
          style={styles.countryCode}
          value="+91"
          editable={false} // Makes the input non-editable
        />
        <TextInput
          style={styles.input}
          onChangeText={handlePhoneChange}
          value={phonenumber}
          maxLength={10} // Limits the input to 10 characters
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        </View>
        <View id='recaptcha'/>
        <View style={styles.termsContainer}>
          <CheckBox
            value={agreeToTerms}
            onValueChange={handleValueChange} // Call handleValueChange on checkbox value change
            style={styles.checkbox}
          />
          <Text style={styles.termsText}>
              By checking this box, I confirm that I have read and accept the{' '}
            <Text style={styles.link} onPress={navigateToTermsPage}>
              Terms of Use and Privacy Policy
            </Text>{' '}
            I also verify that I am 18 years or older.
          </Text>
        </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.customButton, (phonenumber.length === 10 && agreeToTerms)? {} : styles.disabledButton]} onPress={handlePhone}>
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
    codeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30,
    },
    countryCode: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 16,
      color: 'grey',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginRight: 10, // Space between "+91" and the phone number input
      lineHeight: 30,
      height: 50,
      backgroundColor: '#f0f0f0', // Optional: background color to indicate it's non-editable
    },
    input: {
      fontFamily: 'Satoshi-Medium',
      flex : 1,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
    },
    termsContainer: {
      flexDirection: 'row',
      marginTop: 30,
      alignItems: 'flex-start',
    },
    checkbox: {
      marginRight: 10,
      marginTop: 5
    },
    termsText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Satoshi-Medium',
    },
    link: {
      color: '#1E90FF', // Blue color for the links
      fontFamily: 'Satoshi-Bold',
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