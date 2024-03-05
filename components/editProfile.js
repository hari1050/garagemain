import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar,CaretLeft } from 'phosphor-react-native';

export default function editProfile() {

    const navigation = useNavigation();
    const route = useRoute();
    const {name} = route.params;
    const [serviceDate, setserviceDate] = useState(new Date()); 
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [address, setAddress] = useState('');
    const [carPurchaseDate, setCarPuchaseDate] = useState(new Date());
    const [dob,setDob] = useState(new Date());
    const [carModel, setCarModel] = useState('');


    const navigateToConfirmation = () => {
        navigation.navigate('homeScreen',{name:name});
    }

    const navigateToProfile = () => {
        navigation.navigate('userProfile',{name:name});
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || serviceDate;
        setShowDatePicker(false); 
        setserviceDate(currentDate); 
      };

    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
           <TouchableOpacity style={styles.caretLeft} onPress={navigateToProfile}>
            <CaretLeft></CaretLeft>
           </TouchableOpacity>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>
                Name
            </Text>
            <TextInput
                style={styles.input1}
                defaultValue={name}
                editable={false}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>
                Registration Number
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setRegistrationNumber}
                value={registrationNumber}
                placeholder="Registration Number"
                keyboardType="name-phone-pad"
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>
                Cars selected for Service
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setRegistrationNumber}
                value={registrationNumber}
                placeholder="Hyundai"
                keyboardType="name-phone-pad"
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>
                Address
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setAddress}
                value={address}
                placeholder="Address"
                keyboardType="name-phone-pad"
            />
          </View>

          <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Car Purchase Month and Year</Text>
                    <TouchableOpacity style={styles.calendar} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.input}>{carPurchaseDate.toDateString()}</Text>
                        <Calendar></Calendar>
                    </TouchableOpacity>
                        {showDatePicker && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={carPurchaseDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                        )}
          </View>

          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TouchableOpacity style={styles.calendar} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.input}>{dob.toDateString()}</Text>
                        <Calendar></Calendar>
                    </TouchableOpacity>
                        {showDatePicker && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                        )}
          </View>
            
        </ScrollView>
          <View>
              <TouchableOpacity style={styles.customButton} onPress={navigateToConfirmation}>
                <Text style={styles.buttonText}>Save Changes</Text>
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
    buttonContainer:{
      flex: 1,
      justifyContent: 'flex-end', 
      alignItems: 'center', 
    },
    input:{
        padding:12,
        borderRadius:8,
        backgroundColor:'#f5f5f5',
    },
    input1:{
        padding:12,
        borderRadius:8,
        backgroundColor:'#f5f5f5',
        color:'#000'
    },
    inputLabel:{
        marginTop: 8,
        marginBottom: 8,
        fontSize:16,
    },
    inputFieldContainer: {
        paddingTop:8,
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
        padding:4,
        borderRadius:12,
    }
});