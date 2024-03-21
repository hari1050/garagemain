import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabaseConfig';

export default function Servicehistory() {

    const navigation = useNavigation();
    const route = useRoute();
    const {name, phonenumber} = route.params;
    const [bookings, setBookings] = useState([]);

    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
            navigation.navigate('userProfile',{name:name, phonenumber:phonenumber});
            return true; // Prevent default back button behavior
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
      }, [navigation, name])
   );
   const fetchBookings = async () => {
    try {
        const { data, error } = await supabase
            .from('service_orders_table')
            .select('*')
            .eq('phonenumber', phonenumber)
            .eq('IsServiceCancelled', false);

        if (error) {
            console.error('Error fetching bookings:', error.message);
            return;
        }

        setBookings(data || []);
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
    }
    };

    useEffect(() => {
      fetchBookings(); // Fetch bookings when component mounts
  }, [phonenumber]);
    
  const cancelBooking = async(bookingId) => {
    try {
      const { error } = await supabase
        .from('service_orders_table')
        .update({ IsServiceCancelled: 'true' }) 
        .eq('id', bookingId) 
      if(!error){
        await fetchBookings();
      }
    } catch(ex) {
      console.log('error', ex.message);
    }
  }
  const navigateToUserProfile = () => {
        navigation.navigate('userProfile',{name:name, phonenumber:phonenumber});
  }

    return (
      <View style={styles.viewContainer}>

      <ScrollView style={styles.container}>
         <TouchableOpacity style={styles.caretLeft} onPress={navigateToUserProfile}>
          <CaretLeft></CaretLeft>
         </TouchableOpacity>
        <View style={styles.header}>
            <Text style={styles.headerText}>Hi {name}</Text>
        </View>
        
        <Text style={styles.headerText1}>Your Bookings</Text>
        <View style={styles.carddiv}>
                {bookings.map((booking, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Price:</Text>
                            <Text style={styles.value}>Rs. {booking.price[0].Service_cost}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date:</Text>
                            <Text style={styles.value}>{booking.servicedate}</Text>
                        </View>
                        <View style={styles.carModel}>
                            <Text style={styles.label}>Car Model:</Text>
                            <Text style={styles.value}>{booking.carmodel[0].name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Service Type:</Text>
                            <Text style={styles.value}>{booking.servicetype}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Registration Number:</Text>
                            <Text style={styles.value}>{booking.car_reg_no}</Text>
                        </View>
                        <TouchableOpacity style={styles.secondaryButton} onPress={()=> cancelBooking(booking.id)}>
                          <Text style={styles.buttonText}>Cancel Booking</Text>
                        </TouchableOpacity>
                    </View>
                ))}
          </View>
      </ScrollView>
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
    fontFamily: 'Satoshi-Bold',
    fontSize: 22,
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
    height: 54,
    width:'94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 16,
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
  carddiv:{
    marginBottom: 60
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    margin: 10,
    maxWidth: '90%',
  },
  headerText1: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'Satoshi-Bold',    // flex: 1,
  },
  value: {
    fontFamily: 'Satoshi-Medium',
    color: '#333',
    // flex: 2,
  },
  secondaryButton: {
    borderWidth:1,
    borderColor:'#2C152A',
    backgroundColor: '#fff', 
    borderColor:'#2C152A',
    height: 40,
    width:'94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    color: '#2C152A',
    fontSize: 14,
  },
});