import React, { useEffect, useState, useRef } from 'react';
import { Animated, Dimensions, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import Pagination from './Pagination';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, CaretRight, CaretLeft, PlusCircle } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function classicService() {

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
    const screenWidth = Dimensions.get('window').width;


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


    const navigatetoHome = () => {
        navigation.navigate('homeScreen', { selectedCarIndex: selectedCarIndex});
    }
    // const navigateToProfile = () => {
    //   navigation.navigate('userProfile', { name: name, phonenumber: phonenumber });
    // }

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


    const images = [
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/coolant_top_up.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvY29vbGFudF90b3BfdXAucG5nIiwiaWF0IjoxNzIwNTg3NzA0LCJleHAiOjE4NDY3MzE3MDR9.SILE4z-v5X4KT6m02QxPPNoaQ5xSKpofmPmWjF_h5yU&t=2024-07-10T05%3A01%3A43.949Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/wiper_fluid.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2Uvd2lwZXJfZmx1aWQucG5nIiwiaWF0IjoxNzIwNTg3ODIwLCJleHAiOjE4NDY3MzE4MjB9.CDZ0RnubFOZD6tEJ_P4XDtsfsRBfPK90OyxdIfxO_YA&t=2024-07-10T05%3A03%3A40.849Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/rear_lightck.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvcmVhcl9saWdodGNrLnBuZyIsImlhdCI6MTcyMDU4Nzk2MywiZXhwIjoxODQ2NzMxOTYzfQ.ZicGHl69AcK_tXCoCxDJsNz21b5VIoHvGuFR71fGBKk&t=2024-07-10T05%3A06%3A03.357Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/spark_plug.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2Uvc3BhcmtfcGx1Zy5wbmciLCJpYXQiOjE3MjA1ODgwNzQsImV4cCI6MTg0NjczMjA3NH0.k-wfkbS-N2Dd_0GHwn_QSk-5BdNI-bchm4Tuuf67jw4&t=2024-07-10T05%3A07%3A54.154Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/frontlight_ck.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvZnJvbnRsaWdodF9jay5wbmciLCJpYXQiOjE3MjA1ODgxNDYsImV4cCI6MTg0NjczMjE0Nn0.2_gWMFAYKNbhZp1s30Ma72a7yAJId6u_cWbDZVaCaUQ&t=2024-07-10T05%3A09%3A05.937Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/brake_fluid.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvYnJha2VfZmx1aWQucG5nIiwiaWF0IjoxNzIwNTg4MjAxLCJleHAiOjE4NDY3MzIyMDF9.eCZwB92A9HDk_-lcglcaB_mzXSx9-lTd0UCnBXAGC_k&t=2024-07-10T05%3A10%3A01.895Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/brakepad.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvYnJha2VwYWQucG5nIiwiaWF0IjoxNzIwNTg4MjUzLCJleHAiOjE4NDY3MzIyNTN9.Zmvcj_dhrQ9YF2Yji9Ojpx1FtHgCiAVRaDnUo4W6Zmw&t=2024-07-10T05%3A10%3A53.459Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/foamwash.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvZm9hbXdhc2gucG5nIiwiaWF0IjoxNzIwNTg4Mjk4LCJleHAiOjE4NDY3MzIyOTh9.8aRf3TXpuNNjfqtZBWfqqMbn6-1-GjWbzAmq6DkmlLU&t=2024-07-10T05%3A11%3A38.358Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/engineoil.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvZW5naW5lb2lsLnBuZyIsImlhdCI6MTcyMDU4ODM0MywiZXhwIjoxODQ2NzMyMzQzfQ.zKTFsB64Gwb_Hgm8PbhvgfObtFkg0-BpPlLiGGIKPNg&t=2024-07-10T05%3A12%3A23.761Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/newegoil.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvbmV3ZWdvaWwucG5nIiwiaWF0IjoxNzIwNTg4NDAzLCJleHAiOjE4NDY3MzI0MDN9.72jlZUrhz3oAPZeAL61Lp1ra0ztCUSy5twzslbnxKqk&t=2024-07-10T05%3A13%3A23.163Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/eg_oildrained.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvZWdfb2lsZHJhaW5lZC5wbmciLCJpYXQiOjE3MjA1ODg0NDIsImV4cCI6MTg0NjczMjQ0Mn0.fPBxW0h7FdLsxh73fqvDmZZUSWGUrfaOv9SVWOrCih0&t=2024-07-10T05%3A14%3A02.697Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/water_mist.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2Uvd2F0ZXJfbWlzdC5wbmciLCJpYXQiOjE3MjA1ODg0OTksImV4cCI6MTg0NjczMjQ5OX0.y-MFcmZbhcKIEPwRGk74X3vL0f4ebplKzbea6sVrKr8&t=2024-07-10T05%3A14%3A59.166Z' },
      { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/underbodyInspected.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvdW5kZXJib2R5SW5zcGVjdGVkLnBuZyIsImlhdCI6MTcyMDU4ODUyOSwiZXhwIjoxODQ2NzMyNTI5fQ.o2OyBqS82NUtHbR-KlODodxW8oA0_8P-SONAjumupfQ&t=2024-07-10T05%3A15%3A30.366Z' },
  ];

    const Slideshow = () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const flatListRef = useRef(null);
        const scrollIntervalRef = useRef(null);
        const isUserScrollingRef = useRef(false);
        const scrollX = useRef(new Animated.Value(0)).current;
    
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

        const handleScrollToIndexFailed = (info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        };

        const handleOnScroll = event => {
          Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {
              useNativeDriver: false,
            },
          )(event);
        };
    
        return (
          <View>
            <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                style= {{width: '100%'}}
                scrollEnabled
                snapToAlignment="center"
                onScroll={handleOnScroll}
                onScrollToIndexFailed={handleScrollToIndexFailed}
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
                        <Image source={item} style={{borderRadius: 12, height: screenWidth, width: screenWidth*0.8,}} />
                    </View>
                )}
                keyExtractor={(_, index) => index.toString()}
            />
            </View>
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
              {/* <TouchableOpacity onPress={navigateToProfile}>
                  <Image
                  style={styles.profile}
                  source={require('../assets/profile.png')} 
                  />
              </TouchableOpacity> */}
          </View>
          <Slideshow/>
            {/* <Image source={require('../assets/classicService.png')} style={styles.classicServiceImg} /> */}
              <View>
                <View style={styles.classicService}>
                  {/* <TouchableOpacity 
                    style={[styles.summerService, summerServiceAdded && { backgroundColor: 'green' }]} 
                    onPress={handleSummerService}
                  >
                    <Text style={[{ color: summerServiceAdded ? 'white' : 'black', fontFamily: 'Satoshi-Medium', }]}>
                      {summerServiceAdded ? 'Summer Service Added' : 'Add Summer Service worth Rs.1500'}
                    </Text>
                  </TouchableOpacity> */}
                  <Text style={styles.priceheader}>All of the above for just</Text>
                  <View style={styles.priceTag}>
                      <Text style={styles.priceText}>
                      Rs. {totalPrice === null ? 'N/A': totalPrice}
                      {/* Rs. {carPrices.length > 0 ? carPrices[0].Service_cost : 'N/A'} */}
                      </Text>
                  </View>
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
                  <View style={styles.bottomTextContainer}>
                      <Text style={styles.serviceText}>Classic Service</Text>
                      <Text style={styles.serviceDescription}>
                        {'\u2022'} Genuine oil and engine oil filter replacement{'\n'}
                        {'\u2022'} Brake calipers opened, cleaned and lubricated completely{'\n'}
                        {'\u2022'} Up to 200 ml of brake oil, coolant, and steering oil (if equipped) topped up{'\n'}
                        {'\u2022'} Bolts of critical components checked and tightened{'\n'}
                        {'\u2022'} Identification of parts requiring change due to wear and tear{'\n'}
                        {'\u2022'} Washing and interior cleaning of the car (engine bay not washed for critical electronics){'\n'}
                        {'\u2022'} Optional engine oil replacement at an additional cost (customer may buy oil separately based on their preference){'\n'}
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
        height: 430,
        width: 345,
    },
    priceTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#2C152A',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 10,
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
    priceheader: {
      fontFamily: 'Satoshi-Bold',
      marginTop: 8,
      marginLeft: 3,
      marginBottom:8,
      fontSize: 17,
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