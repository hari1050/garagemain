import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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
    navigation.navigate('Nameentry' , {name:name, phonenumber:phonenumber});
  };

  const navigateHome = async () => {
    if (name.length !== 0 && carModels.every(carModel => carModel.name.trim() !== '')) {
      try {
        const userData = {
          name: name,
          carModels: carModels.filter(x => x.name !== ''),
          phonenumber: phonenumber,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data saved to AsyncStorage:', userData);

        const { data, error } = await supabase.from('user_profiles').insert([
          {
            phonenumber: phonenumber,
            fullname: name,
            carmodels: carModels.filter(x => x.name !== ''),
          },
        ]);
        if (error) {
          console.error('Error saving details:', error.message);
        } else {
          console.log('Details saved successfully:', data);
        }
      } catch (error) {
        console.error('Error saving user data to AsyncStorage:', error);
      }
      navigation.navigate('homeTabs', { screen: 'homeScreen' });
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
            id: item.Id,
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

  const isContinueButtonDisabled = name.length === 0 || carModels.some(carModel => carModel.name.trim() === '');

  return (
    <View style={styles.viewContainer}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}>
        <TouchableOpacity style={styles.caretLeft} onPress={handleBack}>
          <CaretLeft />
        </TouchableOpacity>

        <Text style={styles.headerText}>Let us know which cars you rev up everyday</Text>

        <Text style={styles.subHeaderText}>
          Please type in your car model and select it from the dropdown
        </Text>

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
            {index > 0 && carModel.name === '' && (
              <Text style={styles.errorText}>Please select a car</Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addCarButton} onPress={addCarModelInput}>
          <Text style={styles.addcartext}>Add Another Car Model</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[styles.customButton, isContinueButtonDisabled && styles.disabledButton]}
        onPress={navigateHome}
        disabled={isContinueButtonDisabled}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  caretLeft: {
    marginTop: 0,
    marginBottom: 20,
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
  carModelContainer: {
    marginBottom: 10,
  },
  carModelRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 4,
    maxHeight: 137,
    position: 'absolute',
    top: 50,
    width: '100%',
    zIndex: 10,
    marginTop : 8,
  },
  suggestion: {
    fontFamily: 'Satoshi-Medium',
    padding: 6,
  },
  removeButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontFamily: 'Satoshi-Medium',
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
  addcartext: {
    fontFamily: 'Satoshi-Medium',
    color: '#000',
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
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    color: '#fff',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#646464',
  },
});
