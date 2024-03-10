import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, CaretRight, CaretLeft } from 'phosphor-react-native';

export default function winterService() {

    const navigation = useNavigation();
    const route = useRoute();
    const { name,phonenumber, carModels, servicetype, carPrices = []} = route.params;
    const [serviceDate, setserviceDate] = useState(new Date()); // Set initial date to current date
    const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility


    // const navigateToClassicService = () => {
    //     navigation.navigate('homeScreen');
    // }
    const navigatetoHome = () => {
        navigation.navigate('homeScreen',{name:name});
    }
    const navigateToProfile = () => {
        navigation.navigate('homeScreen');
    }

    const handleBookService = () => {
      navigation.navigate('userCompleteDetails',{name:name, carModels:carModels, carPrices:carPrices, servicetype:servicetype, serviceDate:serviceDate, phonenumber:phonenumber});
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || serviceDate;
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
            <Image source={require('../assets/winterService.png')} style={styles.classicServiceImg} />
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
                      Rs. {carPrices.length > 0 ? carPrices[0].Service_cost : 'N/A'}
                      </Text>
                  </View>
                  <View style={styles.bottomTextContainer}>
                      <Text style={styles.serviceText}>Winter Service</Text>
                      <Text style={styles.serviceDescription}>{'\u2022'} Classic Service {'\n'}
                        {'\u2022'} Headlights and fog lamps are optimised {'\n'}
                        {'\u2022'} Engine coolant is checked for concentration and topped up{'\n'}
                        {'\u2022'} Cabin heater is checked for blockage or valve issues.{'\n'}</Text>
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
      backgroundColor: '#fff',
    },
    caretLeft: {
        marginTop:0,
        marginBottom:20,
    },
    header: {
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
    classicService:{
        paddingTop: 10,
    },
    classicServiceImg: {
        borderRadius: 12,
        width: 345,
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
        fontSize: 16,
        color: '#fff'
    },
    serviceText: {
        marginTop: 8,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
    },
    serviceDescription: {
        marginTop: 8,
        marginBottom:8,
        fontSize: 16,
        color: '#000',
        opacity: 0.8,
        textAlign: 'left',
        marginBottom: 120,
    },
    selectDate: {
      marginTop: 8,
      marginBottom:8,
      fontSize: 16,
      color: '#000',
      opacity: 0.8,
      textAlign: 'left',
    },
    headerText: {
      fontSize: 22,
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
      paddingTop: 16,
      paddingBottom: 16,
      display: 'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', 
      bottom: 20, 
      left: 18,
      right: 0,
    },
    calendar: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:345,
        backgroundColor:'#F5F5F5',
        padding:16,
        borderRadius:12,
    }
});