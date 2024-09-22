import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft, Leaf } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioGroup from 'react-native-radio-buttons-group';
import LottieView from 'lottie-react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Customloadingicon from './Customloadingicon'; // Import your custom loading indicator component
import rainAnimation from '../assets/rainAnimation.json'; // Make sure to adjust the path to your rain.json file
import winterAnimation from '../assets/winterAnimation.json'; // Make sure to adjust the path to your rain.json file

export default function Bookingmap() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedOption, setSelectedOption] = useState(null);
  const { name, phonenumber, serviceDate, carModels, servicetype, registrationNumber, carPrices, selectedCarIndex = [] } = route.params;
  const [pickupoption, setpickupoption] = useState('');
  const [selectedId, setSelectedId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSeasonalServiceAdded, setSeasonalservice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animation, setAnimation] = useState(null);
  const [modalText, setModalText] = useState('');
  const [serviceDescription, setServiceDescription] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track if data is currently being loaded

  const navigateToConfirmation = async () => {
    try {
      // Save order details in "service_orders_table" table
      const { data: orderData, error: orderError } = await supabase.from('service_orders_table').insert([
        {
          servicetype: servicetype,
          servicedate: serviceDate,
          phonenumber: phonenumber,
          fullname: name,
          carmodel: [carModels[selectedCarIndex]],
          price: [carPrices[selectedCarIndex]],
          car_reg_no: registrationNumber,
          vehiclePickUpType: selectedId === '1' ? 'Free Pick Up' : 'Self Drive In',
          Is_Seasonal_service_added: isSeasonalServiceAdded
        }
      ]);

      if (orderError) {
        console.error('Error saving order details:', orderError.message);
        return;
      }
      // Navigate to the booking confirmation screen
      navigation.navigate('bookingConfirmation', {
        name: name,
        phonenumber: phonenumber,
        selectedId: selectedId
      });

    } catch (error) {
      console.error('Error saving details:', error.message);
    }
  }

  const navigateTousercompletedetails = () => {
    navigation.navigate('userCompleteDetails', { name: name, carModels: carModels, carPrices: carPrices, servicetype: servicetype, serviceDate: serviceDate, phonenumber: phonenumber, selectedCarIndex: selectedCarIndex });
  }

  const handleConfirmBooking = () => {
    // Open the modal when the confirm booking button is pressed
    setModalVisible(true);
  };

  const handleSaveFromModal = () => {
    // Proceed with saving the order and navigating to the confirmation screen
    var increasedPrice = parseFloat(carPrices[selectedCarIndex]["Service_cost"].replace(/,/g, '')) + 1500;
    var formattedNumber = increasedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    carPrices[selectedCarIndex]["Service_cost"] = formattedNumber;
    setSeasonalservice(true);
    setModalVisible(false);
    setIsLoading(true);
  };

  const handleCancelFromModal = () => {
    setModalVisible(false);
    setIsLoading(true);
    navigateToConfirmation();
  }


  useEffect(() => {
    if (isSeasonalServiceAdded) {
      navigateToConfirmation();
    }
  }, [isSeasonalServiceAdded]);

  useEffect(() => {
    // Fetch the modal data from Supabase
    const fetchModalData = async () => {
        const { data, error } = await supabase
            .from('feature_flags')
            .select('*')
            .eq('id', 1) // Assuming you're fetching a specific row, adjust the query as needed

        if (error) {
            console.error(error);
        } else {
            if (data.length > 0) {
                const modalData = data[0];
                setIsVisible(modalData.is_visible);
                setAnimation(modalData.animation);
                setModalText(modalData.modal_text);
                setServiceDescription(modalData.service_description); // Assuming this is a JSON string
            }
        }
    };

    fetchModalData();
  }, []);

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


  if (isLoading) {
    return <Customloadingicon />;
  }

  return (
    <View style={styles.viewContainer}>

      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.caretLeft} onPress={navigateTousercompletedetails}>
          <CaretLeft />
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
              containerStyle={{ flexDirection: 'column',  alignItems: 'flex-start',}}
              fontFamily="Satoshi-Regular"
            />
          </View>
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity style={[styles.customButton, !selectedId && styles.disabledButton]} disabled={!selectedId} onPress={handleConfirmBooking}>
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {isVisible && (
          <ScrollView style={styles.modalContainer} contentContainerStyle = {{justifyContent: 'center', alignItems: 'center', marginTop: '3%'}}>
          <View style={styles.modalView}>
            <LottieView
              source={animation === 'rain' ? rainAnimation : winterAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>{modalText}</Text>
            <Text style={styles.serviceDescription}>
            {serviceDescription.map((item, index) => (
              <Text key={index}>{`\u2022 ${item}\n`}</Text>
            ))} 
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelFromModal}>
                <Text style={styles.modalButtonText}>No, Thanks</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveFromModal}>
                <Text style={styles.modalButtonTextSave}>Sure</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView> 
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  radioGrp: {
    marginTop: '3%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 18
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Satoshi-Bold',
    paddingTop: 10,
    fontSize: 22,
    color: '#732753',
    textAlign: 'left',
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    color: '#fff',
    fontSize: 18,
  },
  customButton: {
    alignSelf: 'center',
    backgroundColor: '#2C152A',
    height: 54,
    width: '94%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '35%',
  },
  disabledButton: {
    alignSelf: 'center',
    backgroundColor: '#646464',
    height: 54,
    width: '94%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '35%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
},
modalView: {
    width: responsiveWidth(80),  // Adjust the width based on screen width
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),  // Adjust border radius
    padding: responsiveWidth(5),  // Adjust padding
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveHeight(1) },
    shadowOpacity: 0.25,
    shadowRadius: responsiveWidth(2),
    elevation: 5,
},
closeIcon: {
    position: 'absolute',
    top: responsiveHeight(1.5),  // Adjust position
    right: responsiveWidth(4),   // Adjust position
},
closeText: {
    fontSize: responsiveFontSize(2.5),  // Adjust font size
    color: '#000',
},
modalText: {
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
    fontSize: responsiveFontSize(2.1),
},
serviceDescription: {
    marginTop: responsiveHeight(1),
    fontFamily: 'Satoshi-Medium',
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(1.9),
    color: '#000',
    opacity: 0.8,
    textAlign: 'left',
},
modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
},
modalButton: {
    flex: 1,
    alignItems: 'center',
    padding: responsiveWidth(2),
},
modalButtonText: {
    color: '#CB142B',
    fontFamily: 'Satoshi-Medium',
    fontSize: responsiveFontSize(2),
},
modalButtonTextSave: {
    color: '#0000ff',
    fontFamily: 'Satoshi-Medium',
    fontSize: responsiveFontSize(2),
},
animation: {
    width: responsiveWidth(40),  // Adjust animation size
    height: responsiveHeight(25), // Adjust animation size
},
});
