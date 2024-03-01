import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import supabase from '../supabaseConfig';


export default function MainScreen() {
  const navigation = useNavigation();

  const navigateToDetail = (buttonName) => {
    // Here you can fetch data from Supabase based on the buttonName if needed
    // For simplicity, we're just passing the buttonName as a parameter
    navigation.navigate('ServiceDetails', { buttonName });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToDetail('Button1')}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToDetail('Button2')}>
          <Text style={styles.buttonText}>Button 2</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToDetail('Button3')}>
          <Text style={styles.buttonText}>Button 3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToDetail('Button4')}>
          <Text style={styles.buttonText}>Button 4</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.sosButton]}
        onPress={() => navigateToDetail('SOS')}>
        <Text style={styles.buttonText}>SOS</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.button, styles.bottomButton]}
          onPress={() => console.log('Contact Us Pressed')}>
          <Text style={styles.buttonText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.bottomButton]}
          onPress={() => navigation.navigate('DetailsEntryScreen')}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 10,
  },
  sosButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  bottomContainer: {
    position: 'absolute', // Position the container absolutely
    bottom: 0, // At the bottom of the screen
    flexDirection: 'row', // Align buttons in a row
    width: '100%', // Span across the screen width
    justifyContent: 'space-evenly', // Even spacing
    paddingBottom: 10, // Some padding from the bottom edge
  },
  bottomButton: {
    width: '45%', // Adjust width as necessary
    marginHorizontal: 5, // Small space between buttons
    backgroundColor: '#007bff', // Background color
  },
});
