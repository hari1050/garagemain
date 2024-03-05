import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function classicService() {

    const navigation = useNavigation();
    const route = useRoute();
    const { name, carModels, carPrices  } = route.params;
    const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Set initial date to current date
    const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility


    const navigateToClassicService = () => {
            navigation.navigate('homeScreen');
    }

    const navigateToProfile = () => {
        navigation.navigate('homeScreen');
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false); 
        setDateOfBirth(currentDate); 
      };

    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
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
                <TouchableOpacity style={styles.calendar} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.input}>{dateOfBirth.toDateString()}</Text>
                </TouchableOpacity>
                    {showDatePicker && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
                    )}
                  <View style={styles.priceTag}>
                      <Text style={styles.priceText}>
                      Rs. {carPrices.length > 0 ? carPrices[0].Service_cost : 'N/A'}
                      </Text>
                  </View>
                  <View style={styles.bottomTextContainer}>
                      <Text style={styles.serviceText}>Classic Service</Text>
                      <Text style={styles.serviceDescription}>Lorem ipsum dolor sit amet consectetur. Sem rhoncus sed scelerisque eros. Sed sed suspendisse enim cursus. Vitae id pharetra amet in libero integer fringilla sed. Vitae scelerisque bibendum interdum scelerisque elementum. Consequat iaculis non ut feugiat tellus eros. Consectetur porttitor habitant pharetra sit faucibus sit. Sit libero tincidunt elit sit interdum metus eget..</Text>
                  </View>
              </View>
          </View>
        </ScrollView>
          <View>
              <TouchableOpacity style={styles.customButton}>
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
    header: {
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
        paddingTop: 30
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
        
    }
});