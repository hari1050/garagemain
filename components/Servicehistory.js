import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, BackHandler, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import Customloadingicon from './Customloadingicon'; // Import your custom loading indicator component

export default function Servicehistory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, phonenumber } = route.params;
  const [bookings, setBookings] = useState([]);
  const [bookingid, setBookingId] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track if data is currently being loaded
  const [iscancelEnabled, setIsCancelEnabled] = useState(true);


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Check if the previous screen was 'bookingConfirmation'
        if (route.params?.previousScreen === 'bookingConfirmation') {
          navigation.navigate('homeScreen');
        } else {
          navigation.goBack(); // Navigate to the previous screen
        }
        return true; // Prevent default back button behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation, route.params?.previousScreen])
  );

  const fetchBookings = async () => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('service_orders_table')
        .select('*')
        .eq('phonenumber', phonenumber)
        .eq('IsServiceCancelled', false);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError.message);
        return;
      }

      const reversedBookingsData = bookingsData ? [...bookingsData].reverse() : [];

      const { data: featureFlagsData, error: featureFlagsError } = await supabase
            .from('feature_flags')
            .select('is_visible')
            .eq('id', 2);

        if (featureFlagsError) {
            console.error('Error fetching feature flags:', featureFlagsError.message);
            return;
        }

        setBookings(reversedBookingsData || []);
        if (featureFlagsData && featureFlagsData.length > 0) {
          // Get the `is_visible` value from the first row
          const isVisible = featureFlagsData[0].is_visible;
          setIsCancelEnabled(isVisible); // Set state with the `is_visible` value
        } else {
          console.warn('No feature flags data found for id 2');
          setIsCancelEnabled(false); // Default value or handle as needed
        }
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      }
    setIsLoading(false); // Start loading
  };

  useEffect(() => {
    fetchBookings(); // Fetch bookings when component mounts
  }, [phonenumber]);

  const opencancelmodal = async (bookingid) => {
    setBookingId(bookingid);
    setModalVisible(true);
  }

  const handleyesCancelFromModal = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('service_orders_table')
        .update({ IsServiceCancelled: 'true' })
        .eq('id', bookingId);

      if (!error) {
        await fetchBookings();
      }
    } catch (ex) {
      console.log('error', ex.message);
    }
    setModalVisible(false);
    setBookingId('');
  };

  const navigateToUserProfile = () => {
    navigation.navigate('userProfile', { name, phonenumber });
  };

  const handleNoFromModal = () => {
    setModalVisible(false);
  };

  if (isLoading) {
    return <Customloadingicon />;
}

  return (
    <View style={styles.viewContainer}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.caretLeft} onPress={navigateToUserProfile}>
          <CaretLeft />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hi {name}</Text>
        </View>
        <Text style={styles.headerText1}>Your Bookings</Text>
        <View style={styles.carddiv}>
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>So empty, start booking the best care for your car now!</Text>
          </View>
        ) : (
          bookings.map((booking, index) => {
            const serviceCost = booking.price && booking.price[0] ? booking.price[0].Service_cost : 'N/A';
            return (
              <View key={index} style={styles.card}>
                <View style={styles.row}>
                <View style={styles.priceTag}>
                  {booking.servicetype === "Engine Service" ? (
                    <Text style={styles.priceText}>From Rs. 5,000</Text>
                  ) : booking.servicetype === "Painting Service" ? (
                    <Text style={styles.priceText}>From Rs. 2,399</Text>  // "grand" interpreted as Rs. 4,55,000
                  ) : (
                    <Text style={styles.priceText}>~Rs. {serviceCost}</Text>
                  )}
                </View>
                  <View style={[styles.column, styles.dateContainer]}>
                    <Text style={styles.valuest}>{booking.servicedate}</Text>
                  </View>
                </View>
                <View style={styles.carModel}>
                  <Text style={styles.value}>{booking.carmodel && booking.carmodel[0] ? booking.carmodel[0].name : 'Unknown Model'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.valuest}>
                    {booking.servicetype}
                    {booking.Is_Seasonal_service_added ? (
                      <Text style={styles.greenText}>{'\n'}Seasonal Service Added</Text>
                    ) : ('')}
                  </Text>
                </View>
                {booking.IsCompleted ? (
                  <Text style={styles.completedText}>Service Completed</Text>
                ) : (
                  iscancelEnabled && (<TouchableOpacity style={styles.secondaryButton} onPress={()=> opencancelmodal(booking.id)}>
                    <Text style={styles.buttonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                  )
                )}
              </View>
            );
          })
          )}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Do you want to cancel your service ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleNoFromModal}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={()=> handleyesCancelFromModal(bookingid)}>
                <Text style={styles.modalButtonTextSave}>Yes, cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    paddingBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'left',
    paddingBottom: 40,
  },
  buttonContainer: {
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
  carModel: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  dateContainer: {
    marginTop: 5,
    marginLeft: 'auto',
  },
  priceTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#2C152A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  priceText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    color: '#fff',
  },
  logout: {
    borderWidth: 1,
    backgroundColor: '#9B0E0E',
    height: 54,
    width: '94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
  },
  carddiv: {
    marginBottom: 60,
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
  column: {
    alignItems: 'flex-end',
  },
  label: {
    fontFamily: 'Satoshi-Bold',
    // flex: 1,
  },
  value: {
    fontFamily: 'Satoshi-Medium',
    color: '#333',
    fontSize: 13,
    // flex: 2,
  },
  valuest: {
    fontFamily: 'Satoshi-Medium',
    color: '#333',
    fontSize: 18,
  },
  greenText: {
    fontFamily: 'Satoshi-Medium',
    color: 'green',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#2C152A',
    backgroundColor: '#9B0E0E',
    borderColor: '#2C152A',
    height: 40,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    color: '#fff',
    fontSize: 15,
  },
  completedText: {
    alignSelf: 'center',
    fontFamily: 'Satoshi-Bold',
    color: 'darkgreen',
    fontSize: 19,
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
  closeText: {
    fontSize: 18,
    color: '#000',
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
    color: '#0000ff',
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
  },
  modalButtonTextSave: {
    color: '#CB142B',
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
    color: 'grey',
    fontSize: 18,
    marginVertical: 20,
  },
});
