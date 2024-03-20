import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function splashScreen() {
    const navigation = useNavigation();
    const handleSplash = async() => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString !== null) {
          // Parse the stringified userData back into an object
          const userData = JSON.parse(userDataString);
          // Check if userData contains the necessary attributes
          if (userData && 'name' in userData && 'carModels' in userData) {
            // User is logged in, navigate to MainScreen with userData as parameters
            navigation.navigate('homeScreen', {
              name: userData.name,
              carModels: userData.carModels,
            });
          } else {
            // If userData does not contain the necessary attributes, navigate to LoginScreen
            navigation.navigate('phoneNoAuth');
          }
        } else {
          // If no userData is found, navigate to LoginScreen
          navigation.navigate('phoneNoAuth');
        }
     } catch (error) {
        console.error('Error retrieving user data from AsyncStorage:', error);
     }
    };

  return (
    <View style={styles.container}>
      <Image
        style={styles.svgImage}
        source={require('../assets/SureFix.png')} 
      />
      <Text style={styles.title}>Crafted Vehicle Solutions</Text>
      <Image
        style={styles.image}
        source={require('../assets/splashScreen-hero.png')} // Replace with the path to your car image
      />
      <TouchableOpacity style={styles.frame10} onPress={handleSplash}>
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 30,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginVertical: 20,
//   },
//   image: {
//     // backgroundColor:'#000',
//     marginTop:60,
//     width: '100%', // You should adjust this
//     height: 400, // And this, according to your image's aspect ratio
//     resizeMode: 'contain',
//   },
//   svgImage: {
//     // backgroundColor: '#000',
//     width:'80%',
//     height:100,
//     resizeMode: 'contain',
//   },
//   button: {
//     backgroundColor: '#A020F0', // Replace with the color of your button
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   frame10: {
//     alignSelf:'center',
//     backgroundColor: '#2C152A', // Specify your color
//     height: 54,
//     width: 330,
//     // React Native doesn't support CSS filters. For drop shadows, you use elevation for Android, and shadow props for iOS
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
//   },

// });
const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
  },
  title: {
      fontSize: windowHeight * 0.025, // Percentage of window height
      fontWeight: 'bold',
      marginVertical: '2%', // Percentage of window height
  },
  image: {
      marginTop: '8%', // Percentage of window height
      width: '100%', // Full width
      height: windowHeight * 0.5, // 50% of window height
      resizeMode: 'contain',
  },
  svgImage: {
      width: '80%', // 80% of window width
      height: windowHeight * 0.1, // 10% of window height
      resizeMode: 'contain',
  },
  buttonText: {
      color: '#fff',
      fontSize: windowHeight * 0.025, // Percentage of window height
  },
  frame10: {
    alignSelf:'center',
    backgroundColor: '#2C152A', // Specify your color
    height: 54,
    width: 330,
    // React Native doesn't support CSS filters. For drop shadows, you use elevation for Android, and shadow props for iOS
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
  },
});

