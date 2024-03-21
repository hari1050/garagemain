import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Nameentry() {

    const navigation = useNavigation();
    const route = useRoute();
    const {phonenumber} = route.params;
    const [name, setName] = useState('');

    const handleBack = () => {
          navigation.navigate('phoneNoAuth');
    };
    
    const navigateHome = async () => {
        navigation.navigate('Carmodelentry', {name:name, phonenumber:phonenumber});
        
    }

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
        
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.customButton, (name.length != 0 ) ? {} : styles.disabledButton]} onPress={navigateHome}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
        
      </View>
    );
  };
  
  const styles = StyleSheet.create({
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
      paddingBottom: 10
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
      width: '94%',
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
      position: 'relative', // Generally, positioning works similarly to CSS, but its usage is less common in React Native layouts.
    },
    disabledButton: {
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
      // paddingTop: 16,
      // paddingBottom: 16,
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

