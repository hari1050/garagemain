import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Customloadingicon = () => (
  <View style={styles.container}>
    <ActivityIndicator size="larger" color="#732753" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white background
  },
});

export default Customloadingicon;
