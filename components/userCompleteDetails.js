import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, CaretLeft } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function userCompleteDetails() {

    const navigation = useNavigation();
    const route = useRoute();
    const { name,phonenumber,serviceDate, carModels, servicetype, carPrices, selectedCarIndex = []} = route.params;
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [showDobPicker, setShowDobPicker] = useState(false);
    const [showCarPurchaseDatePicker, setShowCarPurchaseDatePicker] = useState(false);
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [address, setAddress] = useState('');
    const [carPurchaseDate, setCarPurchaseDate] = useState(new Date());
    const [dob,setDob] = useState(new Date());

    useEffect(() => {
      const fetchData = async () => {
          try {
              const userDataString = await AsyncStorage.getItem('userData');
               console.log(servicetype)
              if (userDataString !== null) {
                  const userData = JSON.parse(userDataString);
                  setRegistrationNumber(userData.car_reg_no || ''); // Populate registration number
                  setAddress(userData.address || ''); // Populate address
                  const carPurchaseTime = new Date(userData.car_purchase_time);
                  if (!isNaN(carPurchaseTime.getTime())) {
                    setCarPurchaseDate(carPurchaseTime);
                  }
                  const userDob = new Date(userData.dob);
                  if (!isNaN(userDob.getTime())) {
                    setDob(userDob);
                  }
                  
              }
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };

      fetchData(); // Fetch data when component mounts
  }, []);

    const navigateToClassicService = () => {
      console.log(selectedCarIndex);
      navigation.navigate('classicService', {carPrices:carPrices, servicetype:servicetype, serviceDate:serviceDate, selectedCarIndex:selectedCarIndex});
    }

    const navigateToConfirmation = async () => {
      try {
        // Save user details in "user_profiles" table
        const { data: usertableData, error: userError } = await supabase.from('user_profiles').update(
          {
            address: address,
            user_dob: dob,
            car_reg_no: registrationNumber,
            Car_purchase_time: carPurchaseDate
          }
        )
        .eq('phonenumber', phonenumber);
    
        if (userError) {
          console.error('Error saving user details:', userError.message);
          return;
        }
    
        console.log('User details saved successfully:', usertableData);

        let existingUserData = await AsyncStorage.getItem('userData');
        existingUserData = JSON.parse(existingUserData) || {}; // Parse the existing data or initialize as empty object if it doesn't exist

        // Merge existing data with new data
        const updatedUserData = {
            ...existingUserData, // Keep existing data
            address: address || existingUserData.address, // Update address if provided, otherwise keep existing
            dob: dob || existingUserData.dob, // Update dob if provided, otherwise keep existing
            car_reg_no: registrationNumber || existingUserData.car_reg_no, // Update car_reg_no if provided, otherwise keep existing
            car_purchase_time: carPurchaseDate || existingUserData.car_purchase_time // Update car_purchase_time if provided, otherwise keep existing
        };
        // Store updated userData in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        // Navigate to the booking confirmation screen
        navigation.navigate('Bookingmap', {
          name: name,
          phonenumber:phonenumber,
          serviceDate:serviceDate,
          carModels:carModels,
          servicetype: servicetype,
          carPurchaseDate: carPurchaseDate,
          registrationNumber: registrationNumber,
          carPrices: carPrices,
          selectedCarIndex: selectedCarIndex,
        });
        
      } catch (error) {
        console.error('Error saving details:', error.message);
      }
    }

    const handleDateChange = (event, selectedDate, field) => {
      console.log('Selected Date:', selectedDate);
      // Create a new Date object with the same year, month, and day from selectedDate,
      // and set the time to 12 PM (noon)
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0);
      
      if (field === 'dob') {
        setShowDobPicker(false); // Close the date picker first
        setDob(currentDate);
      } else if (field === 'carPurchaseDate') {
        setShowCarPurchaseDatePicker(false); // Close the date picker first
        setCarPurchaseDate(currentDate);
      }
    };
    
  

    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
           <TouchableOpacity style={styles.caretLeft} onPress={navigateToClassicService}>
            <CaretLeft></CaretLeft>
           </TouchableOpacity>
          <View style={styles.header}>
              <Text style={styles.headerText}>Please confirm your details</Text>
              {/* <TouchableOpacity onPress={navigateToProfile}>
                  <Image
                  style={styles.profile}
                  source={require('../assets/profile.png')} 
                  />
              </TouchableOpacity> */}
          </View>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>
                Vehicle number plate no.
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setRegistrationNumber}
                value={registrationNumber}
                placeholder="Registration Number"
                keyboardType="name-phone-pad"
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>
                Address
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setAddress}
                value={address}
                placeholder="Address"
                keyboardType="name-phone-pad"
            />
          </View>

          <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Car Purchase Month and Year</Text>
                    <TouchableOpacity style={styles.calendar} onPress={() => setShowCarPurchaseDatePicker(true)}>
                        <Text style={styles.input}>{carPurchaseDate.toDateString()}</Text>
                        <Calendar></Calendar>
                    </TouchableOpacity>
                        {showCarPurchaseDatePicker && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={carPurchaseDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'carPurchaseDate')}
                        />
                        )}
          </View>

          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TouchableOpacity style={styles.calendar} onPress={() => setShowDobPicker(true)}>
                        <Text style={styles.input}>{dob.toDateString()}</Text>
                        <Calendar></Calendar>
                    </TouchableOpacity>
                        {showDobPicker && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'dob')}
                        />
                        )}
          </View>
            
        </ScrollView>
          <View>
              <TouchableOpacity style={[styles.customButton, (address.length !== 0 && registrationNumber.length !== 0) ? {} : styles.disabledButton]} onPress={navigateToConfirmation}>
                <Text style={styles.buttonText}>Confirm Details</Text>
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
    header: {
        paddingBottom:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profile: {
        width: 40,
        height: 40,
    },
    buttonContainer:{
      flex: 1,
      justifyContent: 'flex-end', 
      alignItems: 'center', 
    },
    input:{
      fontFamily: 'Satoshi-Medium',
        padding:12,
        borderRadius:8,
        backgroundColor:'#f5f5f5',
    },
    inputLabel:{
      fontFamily: 'Satoshi-Medium',
        marginTop: 8,
        marginBottom: 8,
        fontSize:16,
    },
    inputFieldContainer: {
        paddingTop:8,
    },
    headerText: {
      fontFamily: 'Satoshi-Bold',
      paddingTop: 10,
      fontSize: 18,
      color: '#732753',
      textAlign: 'left',
    },
    buttonText: {
      fontFamily: 'Satoshi-Medium',
      color: '#fff',
      fontSize: 18,
    },
    customButton: {
      alignSelf:'center',
      backgroundColor: '#2C152A', 
      height: 54,
      width: '94%',
      elevation: 8, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.5, 
      shadowRadius: 10, 
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      display: 'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: '5%', 
    },
    calendar: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#F5F5F5',
        padding:4,
        borderRadius:12,
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