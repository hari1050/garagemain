import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar, CaretLeft } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import RadioGroup from 'react-native-radio-buttons-group';


export default function Bookingmap() {

    const navigation = useNavigation();
    const route = useRoute();
    const [selectedOption, setSelectedOption] = useState(null);
    const { name,phonenumber,serviceDate, carModels, servicetype,carPurchaseDate, registrationNumber, carPrices = []} = route.params;
    const [pickupoption, setpickupoption] = useState('');
    const google = 'https://www.google.com/maps/place/Classic+car+Care/@19.3906961,72.7825159,17z/data=!4m6!3m5!1s0x3be7adea38f543f3:0x2e89d31efac7bdc1!8m2!3d19.3906961!4d72.7825159!16s%2Fg%2F11q3snm5lp?entry=ttu'
    const [selectedId, setSelectedId] = useState();

    const navigateToConfirmation = async () => {
      try {
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
            car_reg_no: registrationNumber,
            vehiclePickUpType: selectedId === '1' ? 'Free Pick Up' : 'Self Drive In'
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
          phonenumber:phonenumber,
          selectedId: selectedId
        });
        
      } catch (error) {
        console.error('Error saving details:', error.message);
      }
    }


    const navigateTousercompletedetails = () => {
        navigation.navigate('userCompleteDetails',{name:name, carModels:carModels, carPrices:carPrices, servicetype:servicetype, serviceDate:serviceDate, phonenumber:phonenumber});
      }

      const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Free Pick Up',
            value: 'Pick Up'
        },
        {
            id: '2',
            label: 'Self Drive In',
            value: 'Drive In'
        }
    ]), []);
  

    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
           <TouchableOpacity style={styles.caretLeft} onPress={navigateTousercompletedetails}>
            <CaretLeft></CaretLeft>
           </TouchableOpacity>
          <View style={styles.header}>
              <Text style={styles.headerText}>Would you like the car to be picked up at your home for free?</Text>
          </View>
          <View>
          <View style={styles.radioGrp}>
            <RadioGroup 
              radioButtons={radioButtons} 
              onPress={setSelectedId}
              selectedId={selectedId}
            />
          </View>
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
      alignItems: 'center',
    },
    container: {
      flexGrow: 1,
      padding: 20,
      paddingTop: 30,
      backgroundColor: '#fff',
    },
    radioGrp: {
      alignItems:'flex-start',
    },
    webviewOverlay: {
      width:'100%',
      height:500,
      paddingTop: 20,
      // position: 'absolute',
      // top: 0,
      // bottom: 0,
      // left: 0,
      // right: 0,
      backgroundColor: 'transparent', // Transparent background
  },
    header: {
        paddingTop:10,
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
      // paddingTop: 16,
      // paddingBottom: 16,
      display: 'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // position: 'absolute', 
      bottom: 20, 

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