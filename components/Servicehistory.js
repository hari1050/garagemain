import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import supabase from '../supabaseConfig';

export default function Servicehistory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, phonenumber } = route.params;
  const [bookings, setBookings] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('userProfile', { name, phonenumber });
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

  const cancelBooking = async (bookingId) => {
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
  };

  const navigateToUserProfile = () => {
    navigation.navigate('userProfile', { name, phonenumber });
  };

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
          {bookings.map((booking, index) => {
            const serviceCost = booking.price && booking.price[0] ? booking.price[0].Service_cost : 'N/A';
            return (
              <View key={index} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>Rs. {serviceCost}</Text>
                  </View>
                  <View style={[styles.column, styles.dateContainer]}>
                    <Text style={styles.valuest}>{booking.servicedate}</Text>
                  </View>
                </View>
                <View style={styles.carModel}>
                  <Text style={styles.value}>{booking.carmodel && booking.carmodel[0] ? booking.carmodel[0].name : 'Unknown Model'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.valuest}>{booking.servicetype}</Text>
                </View>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => cancelBooking(booking.id)}>
                  <Text style={styles.buttonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  buttonText: {
    color: '#2C152A',
    fontSize: 18,
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
    fontSize: 14,
  },
});
