import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import supabase from './supabaseConfig'; // Import Supabase client
import appConfig from './app.json'; // Import app.json configuration

const getCurrentBuildNumber = (versionString) => {
    const versionParts = versionString.split('.').map(Number);
    if (versionParts.length === 3) {
      const major = versionParts[0];
      const minor = (versionParts[1]); // Sum second and third parts
      return parseFloat(`${major}.${minor}`); // Return as a single decimal
    }
    return parseFloat(versionString); // Fallback in case of unexpected version format
  };

const AppUpdatePrompt = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [latestBuildNumber, setLatestBuildNumber] = useState(null);
  const [isForceUpdate, setisForceUpdate] = useState(false); // Control visibility of "Later" button
  const currentBuildNumber = getCurrentBuildNumber(appConfig.expo.version); // Get current build number from app.json


  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        // Fetch the latest build number from Supabase
        const { data, error } = await supabase
          .from('feature_flags')
          .select('is_visible, master_number ,extra_boolean_force_u')
          .eq('id', 4)
          .single();

        if (error) {
          console.error('Error fetching build number:', error.message);
          return;
        }
        // Compare the current build number with the latest build number
        if (data && data.is_visible && currentBuildNumber < data.master_number) {
          setLatestBuildNumber(data.master_number);
          setisForceUpdate(data.extra_boolean_force_u)
          setShowUpdateModal(true);
        }
        else{
            setShowUpdateModal(false);
        }
      } catch (err) {
        console.error('Error checking for update:', err.message);
      }
    };

    checkForUpdate();
  }, []);

  const handleUpdate = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.unitx.Garageapp'); // Play Store link
  };

  const handleLater = () => {
    setShowUpdateModal(false); // Close the modal
  };

  return (
    <Modal
      transparent={true}
      visible={showUpdateModal}
      animationType="slide"
    >
      <View style={styles.fullScreenOverlay}>
        <View style={styles.updateContainer}>
          <Text style={styles.updateTitle}>Update Available</Text>
          <Text style={styles.updateMessage}>
            New features and fixes are available. Please update your app.
          </Text>
          <View style={isForceUpdate ? styles.singleButtonContainer: styles.buttonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            {!isForceUpdate && (<TouchableOpacity style={styles.laterButton} onPress={handleLater}>
              <Text style={styles.buttonText1}>Later</Text>
            </TouchableOpacity>)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // Dark overlay background
  },
  updateContainer: {
    width: responsiveWidth(90),
    padding: responsiveWidth(5),
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateTitle: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'Satoshi-Bold',
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  updateMessage: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Satoshi-Regular',
    marginBottom: responsiveHeight(4),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // Buttons side by side
    justifyContent: 'space-between',
    width: '100%',
  },
  singleButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  updateButton: {
    borderWidth: 1,
    marginTop: responsiveHeight(1),
    backgroundColor: '#0f8314',
    height: responsiveHeight(6),
    width: '45%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  laterButton: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(6),
    right:responsiveWidth(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Satoshi-Bold',
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
  },
  buttonText1: {
    fontFamily: 'Satoshi-Regular',
    color: 'darkred',
    fontSize: responsiveFontSize(2.2),
  },
});

export default AppUpdatePrompt;
