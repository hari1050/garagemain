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
    const { name,phonenumber,serviceDate, carModels, servicetype, carPrices = []} = route.params;
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [address, setAddress] = useState('');
    const [carPurchaseDate, setCarPuchaseDate] = useState(new Date());
    const [dob,setDob] = useState(new Date());
    const [carModel, setCarModel] = useState('');


    useEffect(() => {
      const fetchData = async () => {
          try {
              const userDataString = await AsyncStorage.getItem('userData');
               console.log(servicetype)
              if (userDataString !== null) {
                  const userData = JSON.parse(userDataString);
                  setRegistrationNumber(userData.car_reg_no || ''); // Populate registration number
                  setAddress(userData.address || ''); // Populate address
              }
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };

      fetchData(); // Fetch data when component mounts
  }, []);

    const navigateToClassicService = () => {
      navigation.navigate('classicService');
    }

    const navigateToConfirmation = async () => {
      try {
        console.log(phonenumber)
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
    
        // Save order details in "order" table
        const { data: orderData, error: orderError } = await supabase.from('service_orders_table').insert([
          {
            servicetype: servicetype,
            servicedate: serviceDate,
            phonenumber: phonenumber,
            fullname: name,
            carmodel: carModels,
            price: carPrices,
            car_purchase_time: carPurchaseDate,
            car_reg_no: registrationNumber
          }
        ]);
    
        if (orderError) {
          console.error('Error saving order details:', orderError.message);
          return;
        }
    
        console.log('Order details saved successfully:', orderData);
    
        // Navigate to the booking confirmation screen
        navigation.navigate('bookingConfirmation', {
          name: name,
          phonenumber:phonenumber
        });
        
      } catch (error) {
        console.error('Error saving details:', error.message);
      }
    }

    const navigateToProfile = () => {
      navigation.navigate('homeScreen');
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || serviceDate;
        setShowDatePicker(false); 
        setserviceDate(currentDate); 
      };

    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
           <TouchableOpacity style={styles.caretLeft} onPress={navigateToClassicService}>
            <CaretLeft></CaretLeft>
           </TouchableOpacity>
          <View style={styles.header}>
              <Text style={styles.headerText}>Hi {name}</Text>
              <TouchableOpacity onPress={navigateToProfile}>
                  <Image
                  style={styles.profile}
                  source={require('../assets/profile.png')} 
                  />
              </TouchableOpacity>
          </View>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>
                Registration Number
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
                    <TouchableOpacity style={styles.calendar} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.input}>{carPurchaseDate.toDateString()}</Text>
                        <Calendar></Calendar>
                    </TouchableOpacity>
                        {showDatePicker && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={carPurchaseDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                        )}
          </View>

          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TouchableOpacity style={styles.calendar} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.input}>{dob.toDateString()}</Text>
                        <Calendar></Calendar>
                    </TouchableOpacity>
                        {showDatePicker && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                        )}
          </View>
            
        </ScrollView>
          <View>
              <TouchableOpacity style={styles.customButton} onPress={navigateToConfirmation}>
                <Text style={styles.buttonText}>Confirm Booking</Text>
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
        padding:12,
        borderRadius:8,
        backgroundColor:'#f5f5f5',
    },
    inputLabel:{
        marginTop: 8,
        marginBottom: 8,
        fontSize:16,
    },
    inputFieldContainer: {
        paddingTop:8,
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#732753',
      textAlign: 'left',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    customButton: {
      backgroundColor: '#2C152A', 
      height: 54,
      width: 350,
      elevation: 8, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.5, 
      shadowRadius: 10, 
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 16,
      paddingBottom: 16,
      display: 'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', 
      bottom: 20, 
      left: 18,
      right: 0,
    },
    calendar: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:345,
        backgroundColor:'#F5F5F5',
        padding:4,
        borderRadius:12,
    }
});