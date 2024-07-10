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
    const [totalPrice, setTotalPrice] = useState("0.00");


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
            source={{ uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/suspension.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2Uvc3VzcGVuc2lvbi5wbmciLCJpYXQiOjE3MjA1ODY5MTcsImV4cCI6MTg0NjczMDkxN30.EuizHbJDm90zb_YLwcRd5k16BQAhCHcogKkJTTUVOqA&t=2024-07-10T04%3A48%3A37.893Zhttps://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/clth.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvY2x0aC5wbmciLCJpYXQiOjE3MjA1ODY2MzUsImV4cCI6MTg0NjczMDYzNX0.BFWzDSMjG5GmCQgyEnVAW6fjXLsWjKCIdnUVw19ZxNE&t=2024-07-10T04%3A43%3A55.742Z' }} 
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
                      Free Inspection
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