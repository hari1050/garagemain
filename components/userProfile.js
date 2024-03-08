import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';

export default function userProfile() {

    const navigation = useNavigation();
    const route = useRoute();
    const {name} = route.params;


    const navigateToHome = () => {
        navigation.navigate('homeScreen',{name:name});
    }

    const navigateToEditProfile = () => {
        navigation.navigate('editProfile',{name:name});
    }


    return (
      <View style={styles.viewContainer}>

      <ScrollView style={styles.container}>
         <TouchableOpacity style={styles.caretLeft} onPress={navigateToHome}>
          <CaretLeft></CaretLeft>
         </TouchableOpacity>
        <View style={styles.header}>
            <Text style={styles.headerText}>Hi {name}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={navigateToEditProfile}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
        
      <Text style={styles.headerText1}>Your Bookings</Text>
      <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>Rs. 2999</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>14/02/2023</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Car Model:</Text>
        <Text style={styles.value}>Hyundai i20</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Service Type:</Text>
        <Text style={styles.value}>Classic Service</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Registration Number:</Text>
        {/* Placeholder for Registration Number */}
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>This is his Address which takes around</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Customer Phone Number:</Text>
        <Text style={styles.value}>7892446715</Text>
      </View>
    </View>
      </ScrollView>
      <View>
          <TouchableOpacity style={styles.logout} onPress={navigateToEditProfile}>
              <Text style={styles.logoutText}>Log out</Text>
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
  caretLeft: {
      marginTop:0,
      marginBottom:20,
  },
  header: {
      paddingBottom:10,
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap:20,
      alignItems: 'left',
      paddingBottom: 40,
  },
  buttonContainer:{
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center', 
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#732753',
    textAlign: 'left',
  },
  buttonText: {
    color: '#2C152A',
    fontSize: 18,
  },
  secondaryButton: {
    borderWidth:1,
    borderColor:'#2C152A',
    backgroundColor: '#fff', 
    borderColor:'#2C152A',
    height: 54,
    width:'94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 16,
    alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    borderWidth:1,
    backgroundColor: '#9B0E0E', 
    height: 54,
    width:'94%',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 12,
    alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
  },
  logoutText:{
    color: '#fff',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    margin: 10,
  },
  headerText1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    color: '#333',
  },
});