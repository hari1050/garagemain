import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import { sendOTPToPhoneNumber } from '../otpConfig';
import supabase from '../supabaseConfig'; // Import Supabase client
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

export default function mobileAuth() {
    const navigation = useNavigation();
    const [otpNumber, setOtpNumber] = useState('');
    const route = useRoute();
    const { phonenumber } = route.params;
    const [OTP, setOTP] = useState(route.params.OTP);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const navigateToMobileAuth = () =>{
          navigation.navigate('phoneNoAuth');
    }
    const handleOtp = async () => {
            if (otpNumber === OTP) {
                try {
                    // Check if the phone number exists in the user_profiles table
                    const { data, error } = await supabase
                        .from('user_profiles')
                        .select('*') // Fetch required columns
                        .eq('phonenumber', phonenumber)
                        .single();

                    if (error) {
                        navigation.navigate('Nameentry', { phonenumber });
                    } else {
                        // Phone number exists, store user details in AsyncStorage
                        const userData = {
                            id: data.id,
                            name: data.fullname,
                            phonenumber: data.phonenumber,
                            carModels: data.carmodels,
                            address: data.address,
                            dob: data.user_dob,
                            car_purchase_time: data.Car_purchase_time,
                            car_reg_no: data.car_reg_no,
                        };

                        // Store user data in AsyncStorage
                        await AsyncStorage.setItem('userData', JSON.stringify(userData));
                        // Navigate to the next screen
                        navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{ name: 'homeTabs' }],
                            })
                        );                    
                    }
                } catch (error) {
                    console.error('Error:', error.message);
                }
            } else {
                setShowErrorPopup(true);
                setTimeout(() => {
                    setShowErrorPopup(false);
                }, 3000);
            }
    };

    const handleResend = async () => {
        const newOTP = await sendOTPToPhoneNumber(phonenumber);
        setOTP(newOTP);
        setTimer(30);
        setCanResend(false);
    };

    return (
        <View style={styles.viewContainer}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
                <TouchableOpacity style={styles.caretLeft} onPress={navigateToMobileAuth}>
                    <CaretLeft />
                </TouchableOpacity>
                <Text style={styles.headerText}>Please enter the OTP</Text>
                <Text style={styles.subHeaderText}>
                    A 4 digit code has been sent to {phonenumber}
                </Text>
                
                <TextInput
                    style={styles.input}
                    onChangeText={setOtpNumber}
                    value={otpNumber}
                    maxLength={4} // Limits the input to 4 characters
                    placeholder="OTP"
                    keyboardType="phone-pad"
                />
                <TouchableOpacity onPress={canResend ? handleResend : null} disabled={!canResend}>
                    <Text style={[styles.subHeaderText, styles.resendLink, !canResend && styles.disabledresendLink]}>
                        {canResend ? "Didn't Receive OTP? Resend" : `Resend OTP in ${timer} seconds`}
                    </Text>
                </TouchableOpacity>
                {showErrorPopup && (
                    <View style={styles.errorPopup}>
                        <Text style={styles.errorPopupText}>OTP is incorrect. Please try again.</Text>
                    </View>
                )}
                <View id="recaptcha" />
            </ScrollView> 
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.customButton, otpNumber.length === 4 ? {} : styles.disabledButton]} onPress={handleOtp}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
        marginTop: 0,
        marginBottom: 20,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Centers children vertically in the container
        alignItems: 'center', 
    },
    headerText: {
        fontFamily: 'Satoshi-Bold',
        fontSize: 22,
        color: '#732753',
        textAlign: 'left',
    },
    subHeaderText: {
        fontFamily: 'Satoshi-Medium',
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
    buttonText: {
        fontFamily: 'Satoshi-Medium',
        color: '#fff',
        fontSize: 18,
    },
    customButton: {
        alignSelf: 'center',
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
        alignSelf: 'center',
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
        bottom: '5%',
    },
    resendLink: {
        fontFamily: 'Satoshi-Medium',
        color: '#732753', // Specify the color for the link
        textDecorationLine: 'underline', // Underline the link
    },
    disabledresendLink: {
        fontFamily: 'Satoshi-Medium',
        color: '#b993a9', // Specify the color for the link
        textDecorationLine: 'underline', // Underline the link
    },
    errorPopup: {
        position: 'absolute',
        top: '120%', 
        left: '20%', 
        right: '20%', 
        padding: 20,
        backgroundColor: '#f8d7da',
        borderColor: '#f5c2c7',
        borderWidth: 1,
        borderRadius: 5,
    },
    errorPopupText: {
        color: '#721c24',
        textAlign: 'center',
        fontFamily: 'Satoshi-Medium',
    },
});
