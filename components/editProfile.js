import React, { useState , useEffect} from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar,CaretLeft } from 'phosphor-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabaseConfig';


export default function editProfile() {

    const navigation = useNavigation();
    const route = useRoute();
    const [name, setName] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [serviceDate, setserviceDate] = useState(new Date()); 
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [address, setAddress] = useState('');
    const [carPurchaseDate, setCarPurchaseDate] = useState(new Date());
    const [dob,setDob] = useState(new Date());
    const [carModelname, setcarModelname] = useState('');
    const [carModels, setCarModels] = useState([{ name: '', id: null }]); // Initial state with one empty car model object
    const [suggestions, setSuggestions] = useState([{ name: '', id: null }]); // New state for holding suggestions


    useEffect(() => {
      const loadUserData = async () => {
          try {
              const userDataString = await AsyncStorage.getItem('userData');
              if (userDataString !== null) {
                  const userData = JSON.parse(userDataString);
                  console.log(userData.name)
                  setName(userData.name || '');
                  setPhoneNumber(userData.phonenumber);
                  setRegistrationNumber(userData.car_reg_no || '');
                  setAddress(userData.address || '');
                  setCarPurchaseDate(new Date(userData.car_purchase_time) || new Date());
                  setDob(new Date(userData.dob) || new Date());
                  setCarModels(userData.carModels || '');
                  setcarModelname(carModels[0].name)
              }
          } catch (error) {
              console.error('Error loading user data from AsyncStorage:', error);
          }
      };
      loadUserData();
    }, []);

    const handleCarModelChange = async (index, value) => {
      const updatedCarModels = [...carModels];
      updatedCarModels[index] = { ...updatedCarModels[index], name: value }; // Update only the name part
      setCarModels(updatedCarModels);
  
      if (value.length > 1) { // Perform search if user has typed at least 2 characters
        try {
          const { data, error } = await supabase
            .from('distinct_modelinfo')
            .select('Car_Model_Fullname, Id')
            .ilike('Car_Model_Fullname', `%${value}%`); // Search for similar car models
          if (error) {
            console.error('Error fetching car models:', error.message);
          } else {
            setSuggestions(data.map(item => ({
              name: item.Car_Model_Fullname,
              id: item.Id
          })));
        }
        } catch (error) {
          console.error('Error fetching car models:', error.message);
        }
      } else {
        setSuggestions([]); // Clear suggestions if input is cleared or too short
      }
    };

    const selectSuggestion = (index, suggestion) => {
      const updatedCarModels = [...carModels];
      updatedCarModels[index] = suggestion;
      setCarModels(updatedCarModels);
      setSuggestions([]); // Clear suggestions after selection
    };

    const navigateToConfirmation = async () => {
      try {
        // Save changes to table
        console.log(phonenumber)
          const { data: usertableData, error: userError } = await supabase.from('user_profiles').update(
            {
              carmodels: carModels,
              address: address,
              user_dob: dob,
              car_reg_no: registrationNumber,
              Car_purchase_time: carPurchaseDate
            }
          )
          .eq('phonenumber', phonenumber);
      
          if (userError) {
            console.error('Error saving user details:', userError.message);
            return;
          }
      
          console.log('User details saved successfully:', usertableData);
                // Save changes to AsyncStorage
          // Fetch existing userData from AsyncStorage
          let existingUserData = await AsyncStorage.getItem('userData');
          existingUserData = JSON.parse(existingUserData) || {}; // Parse the existing data or initialize as empty object if it doesn't exist

          // Merge existing data with new data
          const updatedUserData = {
              ...existingUserData, // Keep existing data
              carModels: carModels || existingUserData.carModels, // Update carModels if provided, otherwise keep existing
              address: address || existingUserData.address, // Update address if provided, otherwise keep existing
              dob: dob || existingUserData.dob, // Update dob if provided, otherwise keep existing
              car_reg_no: registrationNumber || existingUserData.car_reg_no, // Update car_reg_no if provided, otherwise keep existing
              car_purchase_time: carPurchaseDate || existingUserData.car_purchase_time // Update car_purchase_time if provided, otherwise keep existing
          };

          // Store updated userData in AsyncStorage
          await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

          navigation.navigate('userProfile', { name: name });
      } catch (error) {
          console.error('Error saving user data to AsyncStorage:', error);
      }
  };

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
                onChangeText={setName}
                value={name}
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
            />
          </View>

          {/* <View style={styles.inputFieldContainer}> */}
            <Text style={styles.inputLabel}>
                Cars selected for Service
            </Text>
            {carModels.map((carModel, index) => (
            <View key={index} style={styles.carModelContainer}>
            <TextInput
                style={styles.input} // Ensure this style matches other input fields
                placeholder={`Car Model ${index + 1}`}
                value={carModel.name}
                onChangeText={(value) => handleCarModelChange(index, value)}
              />
              {suggestions.length > 0 && (
                <ScrollView style={styles.suggestionsContainer}>
                  {suggestions.map((suggestion, sIndex) => (
                    <TouchableOpacity key={sIndex} onPress={() => selectSuggestion(index, suggestion)}>
                      <Text style={styles.suggestion}>{suggestion.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ))}

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