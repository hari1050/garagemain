import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar, CaretLeft, Trash } from 'phosphor-react-native';
import Customloadingicon from './Customloadingicon';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabaseConfig';
import { showMessage } from 'react-native-flash-message';

export default function EditProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const [typing, setTyping] = useState(false);
  const [name, setName] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showCarPurchaseDatePicker, setShowCarPurchaseDatePicker] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [address, setAddress] = useState('');
  const [carPurchaseDate, setCarPurchaseDate] = useState(new Date());
  const [dob, setDob] = useState(new Date());
  const [carModelname, setCarModelname] = useState('');
  const [carModels, setCarModels] = useState([]); // Initialize as an empty array
  const [suggestions, setSuggestions] = useState([]); // Initialize as an empty array
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track if data is currently being loaded


  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true); // Start loading
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString !== null) {
          const userData = JSON.parse(userDataString);
          setName(userData.name || '');
          setPhoneNumber(userData.phonenumber);
          setRegistrationNumber(userData.car_reg_no || '');
          setAddress(userData.address || '');
          const carPurchaseTime = new Date(userData.car_purchase_time);
          if (!isNaN(carPurchaseTime.getTime())) {
            setCarPurchaseDate(carPurchaseTime);
          }
          // const userDob = new Date(userData.dob);
          // if (!isNaN(userDob.getTime())) {
          //   setDob(userDob);
          // }
          setCarModels(userData.carModels || []);
          setCarModelname(userData.carModels ? userData.carModels[0].name : '');
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
      setIsLoading(false); // End loading
    };
    loadUserData();
  }, []);

  const handleCarModelChange = async (index, value) => {
    setTyping(value.length > 0);
    const updatedCarModels = [...carModels];
    updatedCarModels[index] = { ...updatedCarModels[index], name: value };
    setCarModels(updatedCarModels);

    if (value.length > 1) {
      try {
        const { data, error } = await supabase
          .from('distinct_modelinfo')
          .select('Car_Model_Fullname, Id')
          .ilike('Car_Model_Fullname', `%${value}%`);
        if (error) {
          showMessage({
            message: 'Something went wrong!',
            type: 'danger',
            backgroundColor: 'darkred', // Red for error
            color: '#fff',
            titleStyle: { fontFamily: 'Satoshi-Medium', fontSize: 16 },
          });
          console.error('Error fetching car models:', error.message);
          return;
        } else {
          setSuggestions(
            data.map((item) => ({
              name: item.Car_Model_Fullname,
              id: item.Id,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching car models:', error.message);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (index, suggestion) => {
    const updatedCarModels = [...carModels];
    updatedCarModels[index] = suggestion;
    setCarModels(updatedCarModels);
    setSuggestions([]);
  };

  const addCarModelInput = () => {
    setCarModels([...carModels, { name: '', id: null }]);
  };

  const handleInputFocus = (index) => {
    setActiveIndex(index);
  };

  const removeCarModel = (index) => {
    const updatedCarModels = [...carModels];
    updatedCarModels.splice(index, 1);
    setCarModels(updatedCarModels);
  };

  const navigateToConfirmation = async () => {
    try {
      const { data: usertableData, error: userError } = await supabase
        .from('user_profiles')
        .update({
          fullname: name,
          carmodels: carModels,
          address: address,
          // user_dob: dob,
          car_reg_no: registrationNumber,
          Car_purchase_time: carPurchaseDate,
        })
        .eq('phonenumber', phonenumber);

      if (userError) {
        showMessage({
          message: 'Something went wrong!',
          type: 'danger',
          backgroundColor: 'darkred', // Red for error
          color: '#fff',
          titleStyle: { fontFamily: 'Satoshi-Medium', fontSize: 16 },
        });
        console.error('Error saving user details:', userError.message);
        return;
      }

      console.log('User details saved successfully:', usertableData);

      let existingUserData = await AsyncStorage.getItem('userData');
      existingUserData = JSON.parse(existingUserData) || {};

      const updatedUserData = {
        ...existingUserData,
        name: name || existingUserData.name,
        carModels: carModels || existingUserData.carModels,
        address: address || existingUserData.address,
        // dob: dob || existingUserData.dob,
        car_reg_no: registrationNumber || existingUserData.car_reg_no,
        car_purchase_time: carPurchaseDate || existingUserData.car_purchase_time,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

      navigation.navigate('userProfile', { name: name, phonenumber: phonenumber });
    } catch (error) {
      console.error('Error saving user data to AsyncStorage:', error);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('userProfile', { name: name, phonenumber: phonenumber });
  };

  const handleDateChange = (event, selectedDate, field) => {
    const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0);
    // if (field === 'dob') {
    //   setShowDobPicker(false);
    //   setDob(currentDate);
    // } 
    if (field === 'carPurchaseDate') {
      setShowCarPurchaseDatePicker(false);
      setCarPurchaseDate(currentDate);
    }
  };

  if (isLoading) {
    return <Customloadingicon />;
}

  const isSaveButtonDisabled = carModels.slice(1).some(carModel => carModel.name === '');

  return (
    <View style={styles.viewContainer}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}>
        <TouchableOpacity style={styles.caretLeft} onPress={navigateToProfile}>
          <CaretLeft />
        </TouchableOpacity>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input1}
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />
        </View>

        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Vehicle number plate no.</Text>
          <TextInput
            style={styles.input}
            onChangeText={setRegistrationNumber}
            value={registrationNumber}
            placeholder="Registration Number"
          />
        </View>

        <Text style={styles.inputLabel}>Cars selected for Service</Text>
        {carModels.map((carModel, index) => (
          <View key={index} style={styles.carModelContainer}>
            <View style={styles.carModelRow}>
              <TextInput
                style={styles.input}
                placeholder={`Car Model ${index + 1}`}
                value={carModel.name}
                onChangeText={(value) => handleCarModelChange(index, value)}
                onFocus={() => handleInputFocus(index)}
              />
              {index > 0 && (
                <TouchableOpacity onPress={() => removeCarModel(index)} style={styles.removeButton}>
                  <Trash />
                </TouchableOpacity>
              )}
            </View>
            {index === activeIndex && suggestions.length > 0 && typing && carModel.name.length > 1 && (
              <FlatList
                style={styles.suggestionsContainer}
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => selectSuggestion(index, item)}>
                    <Text style={styles.suggestion}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled={true}
              />
            )}
            {index > 0 && carModel.name === '' && (
              <Text style={styles.errorText}>Please select a car</Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addCarButton} onPress={addCarModelInput}>
          <Text style={styles.addcartext}>Add Another Car Model</Text>
        </TouchableOpacity>

        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Address</Text>
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
          <TouchableOpacity style={styles.calendar} onPress={() => setShowCarPurchaseDatePicker(true)}>
            <Text style={styles.input}>{carPurchaseDate.toDateString()}</Text>
            <Calendar />
          </TouchableOpacity>
          {showCarPurchaseDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={carPurchaseDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'carPurchaseDate')}
            />
          )}
        </View>

        {/* <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TouchableOpacity style={styles.calendar} onPress={() => setShowDobPicker(true)}>
            <Text style={styles.input}>{dob.toDateString()}</Text>
            <Calendar />
          </TouchableOpacity>
          {showDobPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dob}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'dob')}
            />
          )}
        </View> */}
      </ScrollView>
      <View>
        <TouchableOpacity style={[styles.customButton, isSaveButtonDisabled && styles.disabledButton]} onPress={navigateToConfirmation} disabled={isSaveButtonDisabled}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 4,
    zIndex: 99,
    overflow: 'hidden',
    maxHeight: 220,
    width: '100%',
    marginTop: 5,
  },
  carModelContainer: {
    marginBottom: 10,
  },
  carModelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestion: {
    fontFamily: 'Satoshi-Medium',
    padding: 6,
  },
  input: {
    fontFamily: 'Satoshi-Medium',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  input1: {
    fontFamily: 'Satoshi-Medium',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
  inputLabel: {
    fontFamily: 'Satoshi-Medium',
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  inputFieldContainer: {
    paddingTop: 8,
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
    bottom: '10%',
  },
  addCarButton: {
    marginTop: 10,
    alignSelf: 'center',
    height: 36,
    width: '94%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C152A',
    borderRadius: 8,
  },
  removeButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  addcartext: {
    fontFamily: 'Satoshi-Medium',
    color: '#000',
    fontSize: 18,
  },
  calendar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 4,
    borderRadius: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontFamily: 'Satoshi-Medium',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
});
