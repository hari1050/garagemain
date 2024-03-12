import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function bookingConfirmation() {

    const navigation = useNavigation();
    const route = useRoute();
    const { name, phonenumber} = route.params;

    const navigateToHome = () => {
        navigation.navigate('homeScreen',{name:name});
    }

    const navigateToProfile = () => {
        navigation.navigate('userProfile',{name:name , phonenumber:phonenumber});
    }


    return (
        <View style={styles.viewContainer}>

        <ScrollView style={styles.container}>
        <Text style={styles.headerText}>Thank you for choosing SureFix</Text>
        <Image
            style={styles.profile}
            source={require('../assets/success.png')} 
        />
        <Text style={styles.headerText}>You will shortly receive a call from our Service center</Text>
            
        </ScrollView>
          <View>
              <TouchableOpacity style={styles.customButton} onPress={navigateToProfile}>
                <Text style={styles.buttonText}>View Booking Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={navigateToHome}>
                <Text style={styles.secondaryButtonText}>Back to Home</Text>
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
    header: {
        paddingBottom:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
      },
    profile: {
        marginTop:48,
        marginBottom:48,
        width: 352,
        height: 300,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    secondaryButtonText: {
        color:'#2C152A',
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
      bottom: 100, 
      left: 18,
      right: 0,
    },
    secondaryButton: {
        borderWidth:1,
        borderColor:'#2C152A',
        backgroundColor: '#fff', 
        borderColor:'#2C152A',
        height: 54,
        width: 350,
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
});