import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, CaretRight, CaretLeft, PlusCircle } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Suspension() {

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
    const [totalPrice, setTotalPrice] = useState("0.00");
    const summerServiceCost = 1500.00;
    const [countOFslots, setCountOFslots] = useState(0);


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
        if(carPrices[selectedCarIndex].Service_cost === undefined) {

        }
        carPrices[selectedCarIndex].Service_cost = totalPrice;
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


      const images = [
        require('../assets/coolant-top-up.png'),
        require('../assets/wiper-fluid.png'),
        require('../assets/rear-lightck.png'),
        require('../assets/spark-plug.png'),
        require('../assets/frontlight-ck.png'),
        require('../assets/brake-fluid.png'),
        require('../assets/brakepad.png'),
        require('../assets/foamwash.png'),
        require('../assets/engineoil.png'),
        require('../assets/newegoil.png'),
        require('../assets/eg-oildrained.png'),
        require('../assets/water-mist.png'),
        require('../assets/underbodyInspected.png'),
    ];

    const Slideshow = () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const flatListRef = useRef(null);
        const scrollIntervalRef = useRef(null);
        const isUserScrollingRef = useRef(false);
    
        const startAutoScroll = () => {
            scrollIntervalRef.current = setInterval(() => {
                if (!isUserScrollingRef.current) {
                    setCurrentIndex((prevIndex) => {
                        const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
                        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
                        return nextIndex;
                    });
                }
            }, 2000);
        };
    
        const stopAutoScroll = () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    
        useEffect(() => {
            startAutoScroll();
            return () => stopAutoScroll();
        }, []);
    
        return (
            <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                scrollEnabled
                onTouchStart={() => {
                    isUserScrollingRef.current = true;
                    stopAutoScroll();
                }}
                onTouchEnd={() => {
                    isUserScrollingRef.current = false;
                    startAutoScroll();
                }}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View>
                        <Image source={item} style={styles.classicServiceImg} />
                    </View>
                )}
                keyExtractor={(_, index) => index.toString()}
            />
        );
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
          {/* <Slideshow/> */}
          <Image
                  style={styles.imgMain}
                  source={require('../assets/clth.png')} 
                  />
            {/* <Image source={require('../assets/classicService.png')} style={styles.classicServiceImg} /> */}
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
                  <View style={styles.priceTag}>
                      <Text style={styles.priceText}>
                      Rs. {totalPrice === null ? 'N/A': totalPrice}
                      {/* Rs. {carPrices.length > 0 ? carPrices[0].Service_cost : 'N/A'} */}
                      </Text>
                  </View>
                  <View style={styles.bottomTextContainer}>
                    <Text>T&C Applied</Text>
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
        height: 430,
        width: 345,
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
    },
    imgMain: {
        borderRadius: 12,
        width: 345,
        height: 240,
    },
    bottomTextContainer: {
        marginTop:10,
    }
});