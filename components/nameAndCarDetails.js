import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Route } from 'react-router-dom';


export default function nameAndCarDetails() {

    const navigation = useNavigation();
    const route = useRoute();
    const {phonenumber} = route.params;
    const [name, setName] = useState('');
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

        <Text style={styles.headerText}>Just a few more things to get started</Text>

        <Text style={styles.subHeaderText}>
          What should we call you?
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Name"
          keyboardType="name-phone-pad"
        />
        
        <Text style={styles.subHeaderText}>
          Please select your car models
        </Text>
        {carModels.map((carModel, index) => (
        <View key={index} style={styles.carModelContainer}>
         <TextInput
            style={styles.input} // Ensure this style matches other input fields
            placeholder={`Car Model ${index + 1}`}
            value={carModel.name}
            onChangeText={(value) => handleCarModelChange(index, value)}
          />
          {suggestions.length > 0 ? (
            <ScrollView style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, sIndex) => (
                <TouchableOpacity key={sIndex} onPress={() => selectSuggestion(index, suggestion)}>
                  <Text style={styles.suggestion}>{suggestion.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
          
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
    },
    suggestion:{
      padding:6,
    },
    container: {
      flex: 1,
      padding: 20,
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
      paddingTop: 16,
      paddingBottom: 16,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts.
    },
    disabledButton: {
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
      paddingTop: 16,
      paddingBottom: 16,
      display: 'flex', // This is the default display style for React Native components, so it can be omitted
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts
    },
    resendLink: {
      color: '#732753', // Specify the color for the link
      textDecorationLine: 'underline', // Underline the link
    },
});


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { CaretLeft } from 'phosphor-react-native';
// import supabase from '../supabaseConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function NameAndCarDetails() {
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [carModels, setCarModels] = useState([{ name: '', id: null }]);
//   const [suggestions, setSuggestions] = useState([]);

//   const handleBack = () => {
//     navigation.goBack();
//   };

//   const navigateHome = async () => {
//     if (name && carModels.length > 0) {
//       try {
//         const userData = { name, carModels };
//         await AsyncStorage.setItem('userData', JSON.stringify(userData));
//         navigation.navigate('homeScreen', { name, carModels });
//       } catch (error) {
//         console.error('Error saving user data:', error);
//       }
//     }
//   };

//   const handleCarModelChange = async (index, value) => {
//     const updatedCarModels = [...carModels];
//     updatedCarModels[index] = { ...updatedCarModels[index], name: value };
//     setCarModels(updatedCarModels);

//     if (value.length > 1) {
//       try {
//         const { data, error } = await supabase
//           .from('distinct_modelinfo')
//           .select('Car_Model_Fullname, Id')
//           .ilike('Car_Model_Fullname', `%${value}%`);
//         if (error) {
//           console.error('Error fetching car models:', error);
//         } else {
//           setSuggestions(data.map(item => ({
//             name: item.Car_Model_Fullname,
//             id: item.Id
//           })));
//         }
//       } catch (error) {
//         console.error('Supabase error:', error);
//       }
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const selectSuggestion = (index, suggestion) => {
//     const updatedCarModels = [...carModels];
//     updatedCarModels[index] = suggestion;
//     setCarModels(updatedCarModels);
//     setSuggestions([]);
//   };

//   const handleAddMoreCars = () => {
//     setCarModels([...carModels, { name: '', id: null }]);
//   };

//   const handleRemoveCarModel = index => {
//     const updatedCarModels = carModels.filter((_, i) => i !== index);
//     setCarModels(updatedCarModels);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.caretLeft} onPress={handleBack}>
//         <CaretLeft size={24} color="#000" />
//       </TouchableOpacity>

//       <Text style={styles.headerText}>Just a few more things to get started</Text>
      
//       <Text style={styles.subHeaderText}>What should we call you?</Text>
//       <TextInput
//         style={styles.input}
//         onChangeText={setName}
//         value={name}
//         placeholder="Name"
//       />

//       <Text style={styles.subHeaderText}>Please select your car models</Text>
//       {carModels.map((carModel, index) => (
//         <View key={index} style={styles.carModelContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder={`Car Model ${index + 1}`}
//             value={carModel.name}
//             onChangeText={(value) => handleCarModelChange(index, value)}
//           />
//           <TouchableOpacity onPress={() => handleRemoveCarModel(index)}>
//             <Text style={styles.removeButtonText}>Remove</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
      
//       <TouchableOpacity style={styles.addButton} onPress={handleAddMoreCars}>
//         <Text style={styles.addButtonText}>+ Add another car model</Text>
//       </TouchableOpacity>

//       {suggestions.length > 0 && (
//         <ScrollView style={styles.suggestionsContainer}>
//           {suggestions.map((suggestion, sIndex) => (
//             <TouchableOpacity key={sIndex} onPress={() => selectSuggestion(sIndex, suggestion)}>
//               <Text style={styles.suggestionText}>{suggestion.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       )}

//       <TouchableOpacity
//         style={[styles.button, name ? styles.buttonEnabled : styles.buttonDisabled]}
//         onPress={navigateHome}
//         disabled={!name}
//       >
//         <Text style={styles.buttonText}>Continue</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   caretLeft: {
//     marginTop:0,
//     marginBottom:20,
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#732753',
//     textAlign: 'left',
//   },
//   subHeaderText: {
//     fontSize: 16,
//     color: '#000', 
//     marginTop: 30,
//     textAlign: 'left',
//   },
//   input: {
//     marginTop: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   carModelContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   addButton: {
//     // Your styles here
//   },
//   addButtonText: {
//     // Your styles here
//   },
//   removeButtonText: {
//     // Your styles here
//   },
//   suggestionsContainer: {
//     maxHeight: 200, // Set a max height for the suggestions container
//     // Your styles here
//   },
//   suggestionText: {
//     // Your styles here
//   },
//   button: {
//     backgroundColor: '#800080', // Purple color
//     borderRadius: 5,
//     padding: 15,
//     marginTop: 30,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   buttonEnabled: {
//     backgroundColor: '#2C152A', // Specify your color
//       height: 54,
//       width: 350,
//       elevation: 4, // Android shadow
//       shadowColor: '#000', // iOS shadows
//       shadowOffset: { width: 0, height: 4 }, // iOS shadows
//       shadowOpacity: 0.25, // iOS shadows
//       shadowRadius: 6, // iOS shadows
//       borderRadius: 8,
//       paddingLeft: 24,
//       paddingRight: 24,
//       paddingTop: 16,
//       paddingBottom: 16,
//       display: 'flex', // This is the default display style for React Native components, so it can be omitted
//       flexDirection: 'row',
//       justifyContent: 'center',
//       alignItems: 'center',
//       position: 'relative',
//   },
//   buttonDisabled: {
//     backgroundColor: '#646464', // Specify your color
//     height: 54,
//     width: 350,
//     elevation: 4, // Android shadow
//     shadowColor: '#000', // iOS shadows
//     shadowOffset: { width: 0, height: 4 }, // iOS shadows
//     shadowOpacity: 0.25, // iOS shadows
//     shadowRadius: 6, // iOS shadows
//     borderRadius: 8,
//     paddingLeft: 24,
//     paddingRight: 24,
//     paddingTop: 16,
//     paddingBottom: 16,
//     display: 'flex', // This is the default display style for React Native components, so it can be omitted
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
// });

