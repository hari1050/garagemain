import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking, Modal } from 'react-native';
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
    const { name,phonenumber,serviceDate, carModels, servicetype,carPurchaseDate, registrationNumber, carPrices,selectedCarIndex = []} = route.params;
    const [pickupoption, setpickupoption] = useState('');
    const google = 'https://www.google.com/maps/place/Classic+car+Care/@19.3906961,72.7825159,17z/data=!4m6!3m5!1s0x3be7adea38f543f3:0x2e89d31efac7bdc1!8m2!3d19.3906961!4d72.7825159!16s%2Fg%2F11q3snm5lp?entry=ttu'
    const [selectedId, setSelectedId] = useState();
    const [modalVisible, setModalVisible] = useState(false);


    const navigateToConfirmation = async () => {
      try {
        // Save order details in "order" table
        console.log(carModels);
        console.log([carModels[0]]);
        const { data: orderData, error: orderError } = await supabase.from('service_orders_table').insert([
          {
            servicetype: servicetype,
            servicedate: serviceDate,
            phonenumber: phonenumber,
            fullname: name,
            carmodel: [carModels[selectedCarIndex]],
            price: [carPrices[selectedCarIndex]],
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
        navigation.navigate('userCompleteDetails',{name:name, carModels:carModels, carPrices:carPrices, servicetype:servicetype, serviceDate:serviceDate, phonenumber:phonenumber, selectedCarIndex:selectedCarIndex});
      }

    const handleConfirmBooking = () => {
        // Open the modal when the confirm booking button is pressed
        setModalVisible(true);
    };

    const handleSaveFromModal = () => {
      // Proceed with saving the order and navigating to the confirmation screen
      // console.log(carPrices[selectedCarIndex]);
      // console.log(parseFloat(carPrices[selectedCarIndex]["Service_cost"].replace(/,/g, ''))+1500);
      var increasedPrice = parseFloat(carPrices[selectedCarIndex]["Service_cost"].replace(/,/g, ''))+1500;
      var formattedNumber = increasedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      carPrices[selectedCarIndex]["Service_cost"] = formattedNumber;
      console.log(carPrices[selectedCarIndex]);
      setModalVisible(false);
      navigateToConfirmation();
  };
  const handleCancelFromModal = () => {
    setModalVisible(false);
    navigateToConfirmation();
  }

      const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: <Text style={styles.radioButtonText}>  Free Pick Up</Text>, // Style the radio button text here
            value: 'Pick Up'
        },
        {
            id: '2',
            label: <Text style={styles.radioButtonText}>  Self Drive In</Text>, // Style the radio button text here
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
              fontFamily="Satoshi-Regular"
            />
          </View>
          
          </View>
        </ScrollView>
          <View>
              <TouchableOpacity style={[styles.customButton,!selectedId && styles.disabledButton]} disabled={!selectedId} onPress={handleConfirmBooking}>
                <Text style={styles.buttonText}>Confirm Booking</Text>
              </TouchableOpacity>
          </View>

          <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>Would you like to add summer service worth Rs.1500 ?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleCancelFromModal}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={handleSaveFromModal}>
                                <Text style={styles.modalButtonTextSave}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

      </View>
    );
  };
  
  const styles = StyleSheet.create({
    viewContainer: {
      flexGrow: 1,
      backgroundColor: '#fff',
      position: 'relative', 
      // alignItems: 'center',
    },
    container: {
      flexGrow: 1,
      padding: 20,
      paddingTop: 30,
      backgroundColor: '#fff',
    },
    radioGrp: {
      // backgroundColor:'#f5f5f5',
      flexDirection: 'column',
      alignItems:'flex-start',
    },
    radioButtonText: {
      fontFamily: 'Satoshi-Medium', // Set the font family for radio button text
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
      // display: 'flex', // This is the default display style for React Native components, so it can be omitted
      // flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      bottom:'35%',
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
      justifyContent: 'center',
      alignItems: 'center',
      bottom:'35%',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
      width: 300,
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
  },
  closeIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
  },
  modalText: {
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'Satoshi-Medium',
      fontSize: 16,
  },
  modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
  },
  modalButton: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
  },
  modalButtonText: {
      color: '#CB142B',
      fontFamily: 'Satoshi-Medium',
      fontSize: 16,
  },
  modalButtonTextSave: {
    color: '#0000ff',
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
},
});