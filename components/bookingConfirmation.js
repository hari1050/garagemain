import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

export default function bookingConfirmation() {

    const navigation = useNavigation();
    const route = useRoute();
    const { name, phonenumber, selectedId} = route.params;
    const googleMapLink = 'https://www.google.com/maps/place/Classic+car+Care/@19.3906961,72.7825159,17z/data=!4m6!3m5!1s0x3be7adea38f543f3:0x2e89d31efac7bdc1!8m2!3d19.3906961!4d72.7825159!16s%2Fg%2F11q3snm5lp?entry=ttu'


    useFocusEffect(
      React.useCallback(() => {
          const onBackPress = () => {
              // Return true to indicate that we've handled the back press
              // and don't want the default behavior to occur
              return true;
          };

          // Add listener for the hardware back button
          BackHandler.addEventListener('hardwareBackPress', onBackPress);

          // Remove listener when component is unfocused or unmounted
          return () => {
              BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          };
      }, [])
  );

  const navigateToMap = () => {
    Linking.openURL(googleMapLink);
  }
  
  const navigateToHome = () => {
        navigation.navigate('homeScreen');
  }

  const navigateToProfile = () => {
        navigation.navigate('Servicehistory',{name:name , phonenumber:phonenumber});
  }


    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
        <View style={styles.messagecontainer}>
        <Text style={styles.headerText}>Thank you for choosing SureFix</Text>
        <Image
            style={styles.profile}
            source={require('../assets/success.png')} 
        />
        <Text style={styles.headerText}>You will shortly receive a call from our Service center</Text>
            
        </View>
          <View style={styles.buttoncontainer}>
              {selectedId === '2' && (
                    <TouchableOpacity style={styles.customButton} onPress={navigateToMap}>
                        <Text style={styles.buttonText}>Get directions</Text>
                    </TouchableOpacity>
              )}
              <View style={styles.buttonSpacing} />
              <TouchableOpacity style={styles.customButton} onPress={navigateToProfile}>
                <Text style={styles.buttonText}>View Booking Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={navigateToHome}>
                <Text style={styles.secondaryButtonText}>Back to Home</Text>
              </TouchableOpacity>
          </View>
          </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    viewContainer: {
      flexGrow: 1,
      backgroundColor: '#fff',
    },
    container: {
      padding: 10,
      paddingTop: 60,
      backgroundColor: '#fff',
    },
    messagecontainer: {
      paddingBottom: 60
    },
    buttoncontainer: {
      paddingTop: '5%',
      paddingBottom: 70
    },
    header: {
        paddingBottom:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
      fontFamily: 'Satoshi-Bold',
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
      },
    profile: {
        alignSelf:'center',
        marginTop:30,
        marginBottom:48,
        width: 300,
        height: 230,
    },
    buttonText: {
      fontFamily: 'Satoshi-Medium',
      color: '#fff',
      fontSize: 18,
    },
    secondaryButtonText: {
      fontFamily: 'Satoshi-Medium',
        color:'#2C152A',
        fontSize: 18,
    },
    customButton: {
      alignSelf:'center',
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
      // paddingTop: 16,
      // paddingBottom: 12,
      display: 'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: '15%', 
      right: 0,
    },
    secondaryButton: {
        alignSelf:'center',
        borderWidth:1,
        borderColor:'#2C152A',
        backgroundColor: '#fff', 
        borderColor:'#2C152A',
        height: 54,
        width: '94%',
        borderRadius: 8,
        paddingLeft: 24,
        paddingRight: 24,
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '10%', 
        right: 0,
      },
      buttonSpacing: {
        height: 20, // Adjust the height as needed for the desired space between buttons
    },
});