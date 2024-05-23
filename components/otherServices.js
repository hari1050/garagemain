import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, CaretRight, CaretLeft, PlusCircle } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function otherServices() {

    const navigation = useNavigation();
    const route = useRoute();
    const [name, setName] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [carModels, setCarModels] = useState([]);
    const {selectedCarIndex, setSelectedCarIndex= []} = route.params;
    const {servicetype, carPrices = []} = route.params;
    const [serviceDate, setserviceDate] = useState(() => {
      // Create a new Date object for the current date with the time set to 12 PM (noon)
      const currentDate = new Date();
      currentDate.setHours(12, 0, 0, 0);
      return currentDate;
    });
    const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility
    const [summerServiceAdded, setSummerServiceAdded] = useState(false);
    const [totalPrice, setTotalPrice] = useState(carPrices.length > 0 ? carPrices[selectedCarIndex].Service_cost : 0);
    const summerServiceCost = 1500.00;
    const [countOFslots, setCountOFslots] = useState(0);

    // useEffect(()=> {
    //   getCountOfSlot();
      
    // },[]);

    useEffect(() => {
      const initializeUserData = async () => {
          try {
              const userDataString = await AsyncStorage.getItem('userData');
              if (userDataString !== null) {
                  const userData = JSON.parse(userDataString);
                  setName(userData.name);
                  setCarModels(userData.carModels);
                  setPhoneNumber(userData.phonenumber);
              }
          } catch (error) {
              console.log("Error retrieving user data from AsyncStorage:", error);
          }
      };

      initializeUserData();
    }, []);

    const handleSummerService = () => {
      const numericTotalPrice = parseFloat(totalPrice.replace(/,/g, ''));
      if(!summerServiceAdded){
        setSummerServiceAdded(true);
        const updatedTotalPrice = numericTotalPrice + parseFloat(summerServiceCost);
        setTotalPrice(updatedTotalPrice.toFixed(2));
      } else if(summerServiceAdded){
        console.log(totalPrice);
        setSummerServiceAdded(false);
        const updatedTotalPrice = numericTotalPrice - parseFloat(summerServiceCost);
        setTotalPrice(updatedTotalPrice.toFixed(2));
      }
    }

    const getCountOfSlot = async() => {
      try {
        const { data: datesWith50OrMoreOrders, error } = await supabase
          .from('service_date_numbers')
          .select('service_date')
          .gte('order_count', 1);
    
        if (error) {
          throw error;
        }
        console.log(datesWith50OrMoreOrders)
        return datesWith50OrMoreOrders;
      } catch (error) {
        console.error('Error fetching dates:', error.message);
        return [];
      }
    }


    const navigatetoHome = () => {
        navigation.navigate('homeScreen', { selectedCarIndex: selectedCarIndex});
    }
    const navigateToProfile = () => {
      navigation.navigate('userProfile', { name: name, phonenumber: phonenumber });
    }

    const handleBookService = () => {
        carPrices[selectedCarIndex].Service_cost = totalPrice;
        // console.log(totalPrice,'totalPrice');
        // console.log(serviceDate);
        // console.log(selectedCarIndex);
        navigation.navigate('userCompleteDetails',{name:name, carModels:carModels, carPrices:carPrices, servicetype:servicetype, serviceDate:serviceDate, phonenumber:phonenumber, selectedCarIndex:selectedCarIndex});
      }

      const today = new Date();
      today.setHours(0,0,0,0);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);



      const handleDateChange = (event, selectedDate) => {
        // Set the time to 12 PM (noon)
        const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0);
        console.log("Current Date:", currentDate);
        setShowDatePicker(false); 
        setserviceDate(currentDate);
      };
      

    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
           <TouchableOpacity style={styles.caretLeft} onPress={navigatetoHome}>
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
            <Image source={require('../assets/classicService.png')} style={styles.classicServiceImg} />
              <View>
                <View style={styles.classicService}>
                <Text style={styles.selectDate}>Select Service Date</Text>
                <TouchableOpacity style={styles.calendar} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.input}>{serviceDate.toDateString()}</Text>
                    <Calendar></Calendar>
                </TouchableOpacity>
                    {showDatePicker && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={serviceDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={today}
                />
                    )}
                  <TouchableOpacity 
                    style={[styles.summerService, summerServiceAdded && { backgroundColor: 'green' }]} 
                    onPress={handleSummerService}
                  >
                    <Text style={[{ color: summerServiceAdded ? 'white' : 'black', fontFamily: 'Satoshi-Medium', }]}>
                      {summerServiceAdded ? 'Summer Service Added' : 'Add Summer Service worth Rs.1500'}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.priceTag}>
                      <Text style={styles.priceText}>
                      Rs. {totalPrice === null ? 'N/A': totalPrice}
                      {/* Rs. {carPrices.length > 0 ? carPrices[0].Service_cost : 'N/A'} */}
                      </Text>
                  </View>
                  <View style={styles.bottomTextContainer}>
                      <Text style={styles.serviceText}>Classic Service</Text>
                      <Text style={styles.serviceDescription}>
                        {'\u2022'} Genuine oil and engine air filter replacement{'\n'}
                        {'\u2022'} Brake assembly opened and cleaned completely{'\n'}
                        {'\u2022'} Up to 200 ml of brake oil, coolant, and steering oil (if equipped) topped up{'\n'}
                        {'\u2022'} Bolts of critical components checked and tightened{'\n'}
                        {'\u2022'} Identification and communication of parts requiring change due to wear and tear{'\n'}
                        {'\u2022'} Washing and interior cleaning of the car (engine bay not washed for critical electronics){'\n'}
                        {'\u2022'} Optional engine oil replacement at an additional cost (customer may buy oil separately){'\n'}
                        {'\u2022'} Lubrication of window channels, greasing of door hinges, and seat rails{'\n'}
                        {'\u2022'} Testing of all lights and bulbs for functionality{'\n'}
                        {'\u2022'} Checking battery health{'\n'}
                        {'\u2022'} Checking AC performance with a thermometer{'\n'}
                        {'\u2022'} Inspection of tires for tread wear; alignment and balancing available at an extra discounted rate{'\n'}
                        {'\u2022'} For BS4 cars, checking and cleaning (or replacement if necessary) of spark plugs{'\n'}
                        {'\u2022'} Checking spare tire for air pressure; lubrication and storage of tools{'\n'}
                      </Text>
                  </View>
              </View>
          </View>
        </ScrollView>
          <View>
              <TouchableOpacity style={styles.customButton} onPress={handleBookService}>
                <Text style={styles.buttonText}>Book Service</Text>
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
    caretLeft: {
        marginTop:0,
        marginBottom:20,
    },
    summerService: {
      alignSelf:'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      width: '100%',
      borderWidth: 1,
      borderRadius: 12,
      borderColor: '#000',
      marginTop: 28,
      shadowColor: '#000',
      shadowOpacity: 0.8, // Increased shadow opacity for a stronger embossed effect
      shadowRadius: 8, // Increased shadow radius for a stronger embossed effect
      shadowOffset: { width: 0, height: 8 }, // Increased shadow offset for a stronger embossed effect
      backgroundColor: '#F5F5F5', // Lighter background color for embossed effect
    },
    
    header: {
        paddingBottom:30,
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
    classicService:{
        paddingTop: 10,
    },
    classicServiceImg: {
        borderRadius: 12,
        width: '100%',
        height: 396,
    },
    priceTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#2C152A',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 26,
      },
    priceText: {
      fontFamily: 'Satoshi-Medium',
        fontSize: 16,
        color: '#fff'
    },
    serviceText: {
      fontFamily: 'Satoshi-Bold',
        marginTop: 8,
        fontSize: 22,
        color: '#000',
        textAlign: 'left',
    },
    serviceDescription: {
        marginTop: 8,
        fontFamily: 'Satoshi-Medium',
        marginBottom:8,
        fontSize: 16,
        color: '#000',
        opacity: 0.8,
        textAlign: 'left',
        marginBottom: 120,
    },
    selectDate: {
      fontFamily: 'Satoshi-Medium',
      marginTop: 8,
      marginLeft: 12,
      marginBottom:8,
      fontSize: 16,
      color: '#000',
      opacity: 0.8,
      textAlign: 'left',
    },
    input:{
      fontFamily: 'Satoshi-Medium',
    },
    headerText: {
      fontFamily: 'Satoshi-Bold',
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
        alignSelf:'center',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%',
        backgroundColor:'#F5F5F5',
        padding:16,
        borderRadius:12,
    }
});