import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign from Expo
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import supabase from '../supabaseConfig';
import { useNavigation } from '@react-navigation/native';


export default function DetailsEntryScreen({ route }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail]  = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Set initial date to current date
  const [carModels, setCarModels] = useState(['']); // Initial state with one empty car model
  const [suggestions, setSuggestions] = useState([]); // New state for holding suggestions
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility
  const navigation = useNavigation();

  const handleSaveDetails = async () => {
    try {
      // Save user details in USERSMAIN table
      const { data, error } = await supabase.from('user_profiles').insert([
        {
          email: email,
          fullname: fullName,
          phonenumber: phoneNumber,
          address: address,
          user_dob: dateOfBirth,
          carmodels: carModels,
        }
      ]);

      if (error) {
        console.error('Error saving details:', error.message);
      } else {
        console.log('Details saved successfully:', data);
        navigation.navigate('MainScreen');
        // Optionally, navigate to another screen or perform further actions
      }
    } catch (error) {
      console.error('Error saving details:', error.message);
    }
  };

  const addCarModelField = () => {
    setCarModels([...carModels, '']);
  };

  // Function to handle car model change and perform search
  const handleCarModelChange = async (index, value) => {
    const updatedCarModels = [...carModels];
    updatedCarModels[index] = value;
    setCarModels(updatedCarModels);

    if (value.length > 1) { // Perform search if user has typed at least 2 characters
      try {
        const { data, error } = await supabase
          .from('distinct_modelinfo')
          .select('Car_Model_Fullname')
          .ilike('Car_Model_Fullname', `%${value}%`); // Search for similar car models

        if (error) {
          console.error('Error fetching car models:', error.message);
        } else {
          setSuggestions(data.map((item) => item.Car_Model_Fullname)); // Update suggestions state
        }
      } catch (error) {
        console.error('Error fetching car models:', error.message);
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is cleared or too short
    }
  };


  const removeCarModelField = (index) => {
    const updatedCarModels = [...carModels];
    updatedCarModels.splice(index, 1);
    setCarModels(updatedCarModels);
  };

  // Function to select a suggestion
  const selectSuggestion = (index, suggestion) => {
    const updatedCarModels = [...carModels];
    updatedCarModels[index] = suggestion;
    setCarModels(updatedCarModels);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false); // Close the date picker
    setDateOfBirth(currentDate); // Update the selected date
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number (WhatsApp)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false} //Disabled field
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
      <Text style={styles.label}>Car Models:</Text>
      {carModels.map((carModel, index) => (
        <View key={index} style={styles.carModelContainer}>
         <TextInput
            style={styles.input} // Ensure this style matches other input fields
            placeholder={`Car Model ${index + 1}`}
            value={carModel}
            onChangeText={(value) => handleCarModelChange(index, value)}
          />
          {suggestions.length > 0 && (
            <ScrollView style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, sIndex) => (
                <TouchableOpacity key={sIndex} onPress={() => selectSuggestion(index, suggestion)}>
                  <Text style={styles.suggestion}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {index > 0 && (
            <TouchableOpacity onPress={() => removeCarModelField(index)}>
              <AntDesign name="minuscircle" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addCarModelField}>
        <Text style={styles.addCarModelButton}>+ Add Car Model</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSaveDetails}>
        <Text style={styles.button}>Save Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10, // Rounded corners
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carModelContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  addCarModelButton: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
  suggestionsContainer: {
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 5,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
});
