import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import { Trash } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Carmodelentry() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phonenumber, name } = route.params;
  const [carModels, setCarModels] = useState([{ name: '', id: null }]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleBack = () => {
    navigation.navigate('phoneNoAuth');
  };

  const navigateHome = async () => {
    if (name.length !== 0) {
      try {
        const userData = {
          name: name,
          carModels: carModels,
          phonenumber: phonenumber
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data saved to AsyncStorage:', userData);

        const { data, error } = await supabase.from('user_profiles').insert([
          {
            phonenumber: phonenumber,
            fullname: name,
            carmodels: carModels,
          }
        ]);
        if (error) {
          console.error('Error saving details:', error.message);
        } else {
          console.log('Details saved successfully:', data);
        }

      } catch (error) {
        console.error('Error saving user data to AsyncStorage:', error);
      }
      navigation.navigate('homeScreen');
    }
  };

  const handleCarModelChange = async (index, value) => {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.caretLeft} onPress={handleBack}>
        <CaretLeft />
      </TouchableOpacity>

      <Text style={styles.headerText}>Let us know which cars you rev up everyday</Text>

      <Text style={styles.subHeaderText}>
        Please select your car models
      </Text>

      {carModels.map((carModel, index) => (
        <View key={index} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Car Model ${index + 1}`}
            value={carModel.name}
            onChangeText={(value) => handleCarModelChange(index, value)}
            onFocus={() => handleInputFocus(index)}
          />
          {index === activeIndex && suggestions.length > 0 && carModel.name.length > 1 && (
            <FlatList
              style={styles.suggestionsContainer}
              data={suggestions}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectSuggestion(index, item)}>
                  <Text style={styles.suggestion}>{item.name}</Text>
                </TouchableOpacity>
              )}
              nestedScrollEnabled={true}
            />
          )}
          {index > 0 && (
            <TouchableOpacity onPress={() => removeCarModel(index)} style={styles.removeButton}>
              <Trash />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addCarButton} onPress={addCarModelInput}>
        <Text style={styles.addcartext}>Add Another Car Model</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.customButton, (name.length !== 0 && carModels.some(model => model.name.trim() !== '')) ? {} : styles.disabledButton]} onPress={navigateHome}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 4,
    maxHeight: 300, // Set a max height to enable scrolling
    position: 'absolute',
    top: 50, // Position it below the input field
    width: '100%',
    zIndex: 1, // Ensure it appears above other elements
  },
  suggestion: {
    fontFamily: 'Satoshi-Medium',
    padding: 6,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  caretLeft: {
    marginTop: 0,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Centers children vertically in the container
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 22,
    color: '#732753',
    textAlign: 'left',
  },
  subHeaderText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    color: '#000',
    marginTop: 30,
    textAlign: 'left',
  },
  input: {
    flex: 1,
    fontFamily: 'Satoshi-Medium',
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#800080', // Purple color
    borderRadius: 5,
    padding: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    color: '#fff',
    fontSize: 18,
  },
  addcartext: {
    fontFamily: 'Satoshi-Medium',
    color: '#000',
    fontSize: 18,
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
  customButton: {
    alignSelf: 'center',
    backgroundColor: '#2C152A', // Specify your color
    height: 54,
    width: '94%',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadows
    shadowOffset: { width: 0, height: 4 }, // iOS shadows
    shadowOpacity: 0.25, // iOS shadows
    shadowRadius: 6, // iOS shadows
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    display: 'flex', // This is the default display style for React Native components, so it can be omitted
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    alignSelf: 'center',
    backgroundColor: '#646464', // Specify your color
    height: 54,
    width: '94%',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadows
    shadowOffset: { width: 0, height: 4 }, // iOS shadows
    shadowOpacity: 0.25, // iOS shadows
    shadowRadius: 6, // iOS shadows
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    display: 'flex', // This is the default display style for React Native components, so it can be omitted
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendLink: {
    color: '#732753', // Specify the color for the link
    textDecorationLine: 'underline', // Underline the link
  },
});
