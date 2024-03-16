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
      navigation.navigate('classicService', {carPrices:carPrices, servicetype:servicetype, serviceDate:serviceDate});
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

    const handleDateChange = (event, selectedDate, field) => {
      console.log('Selected Date:', selectedDate);
      const istOffset = 5.5; // IST offset in hours
      const istDate = new Date(selectedDate.getTime() + (istOffset * 60 * 60 * 1000));
      const currentDate = istDate || (field === 'dob' ? dob : carPurchaseDate);
      console.log(istDate)
      if (field === 'dob') {
          setDob(currentDate);
          setShowDobPicker(false);
      } else if (field === 'carPurchaseDate') {
          setCarPurchaseDate(currentDate);
          setShowCarPurchaseDatePicker(false);
      }
    };
  

    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
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
      paddingTop: 10,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#732753',
      textAlign: 'left',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    customButton: {
      alignSelf:'center',
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
      paddingBottom: 12,
      display: 'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // position: 'absolute', 
      bottom: 20, 
      // left: 18,
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