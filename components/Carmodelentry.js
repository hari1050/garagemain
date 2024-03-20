import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Carmodelentry() {

    const navigation = useNavigation();
    const route = useRoute();
    const {phonenumber, name} = route.params;
    const [carModels, setCarModels] = useState([{ name: '', id: null }]); // Initial state with one empty car model object
    const [suggestions, setSuggestions] = useState([{ name: '', id: null }]); // New state for holding suggestions

    const handleBack = () => {
          navigation.navigate('phoneNoAuth');
    };
    
    const navigateHome = async () => {
        if(name.length != 0) {
          try {
            const userData = { 
              name:name, 
              carModels:carModels,
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
    }

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

    return (
        
      <View style={styles.container}>
        <TouchableOpacity style={styles.caretLeft} onPress={handleBack}>
            <CaretLeft/>
        </TouchableOpacity>

        <Text style={styles.headerText}>Let us know which car you rev up everyday</Text>
        
        <Text style={styles.subHeaderText}>
          Please select your car model
        </Text>
        {carModels.map((carModel, index) => (
        <View key={index} style={styles.carModelContainer}>
         <TextInput
            style={styles.input} // Ensure this style matches other input fields
            placeholder={`Car Model ${index + 1}`}
            value={carModel.name}
            onChangeText={(value) => handleCarModelChange(index, value)}
          />
          {suggestions.length > 0 && carModel.name.length > 1 && (
                <FlatList style={[styles.suggestionsContainer, styles.scrollContainer]}
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
          
        </View>
      ))}
        
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.customButton, (name.length != 0 && carModels.some(model => model.name.trim() !== '')) ? {} : styles.disabledButton]} onPress={navigateHome}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
        
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    suggestionsContainer:{
      backgroundColor:'#fff',
      borderRadius:4,
      borderWidth:1,
      borderColor:'#ddd',
      elevation:4,
      maxHeight: 300, // Set a max height to enable scrolling
      overflow: 'scroll', // Enable scrolling
      width: '100%'
    },
    scrollContainer: {
      paddingBottom: 6, // Add some padding to the bottom to ensure the content is not clipped
    },
    suggestion:{
      padding:6,
    },
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 30,
      backgroundColor: '#fff',
    },
    caretLeft: {
        marginTop:0,
        marginBottom:20,
    },
    buttonContainer:{
      flex: 1,
      justifyContent: 'flex-end', // Centers children vertically in the container
      alignItems: 'center', 
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#732753',
      textAlign: 'left',
    },
    subHeaderText: {
      fontSize: 16,
      color: '#000', 
      marginTop: 30,
      textAlign: 'left',
    },
    input: {
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
      color: '#fff',
      fontSize: 18,
    },
    customButton: {
      alignSelf:'center',
      backgroundColor: '#2C152A', // Specify your color
      height: 54,
      width: 350,
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadows
      shadowOffset: { width: 0, height: 4 }, // iOS shadows
      shadowOpacity: 0.25, // iOS shadows
      shadowRadius: 6, // iOS shadows
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      // paddingTop: 16,
      // paddingBottom: 16,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts.
    },
    disabledButton: {
      alignSelf:'center',
      backgroundColor: '#646464', // Specify your color
      height: 54,
      width: 350,
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadows
      shadowOffset: { width: 0, height: 4 }, // iOS shadows
      shadowOpacity: 0.25, // iOS shadows
      shadowRadius: 6, // iOS shadows
      borderRadius: 8,
      paddingLeft: 24,
      paddingRight: 24,
      // paddingTop: 16,
      // paddingBottom: 16,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts
    },
    resendLink: {
      color: '#732753', // Specify the color for the link
      textDecorationLine: 'underline', // Underline the link
    },
});

