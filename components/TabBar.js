import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { House, Warning, User } from 'phosphor-react-native'; // Ensure these are correct

const TabBar = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('homeScreen');
        setCurrentIndex(0); // Ensure "Home" tab is selected on back press
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation])
  );

  const handlePress = (index, routeName) => () => {
    setCurrentIndex(index);
    navigation.navigate(routeName);
  };

  const getTextStyle = (index) => ({
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color: currentIndex === index ? (index === 1 ? 'red' : '#472144') : 'grey',
  });

  const getIcon = (index) => {
    switch (index) {
      case 0:
        return currentIndex === index ? <House weight="fill" size={24} color='#472144' /> : <House size={24} color='grey' />;
      case 1:
        return currentIndex === index ? <Warning weight="fill" size={24} color='red' /> : <Warning size={24} color='grey' />;
      case 2:
        return currentIndex === index ? <User weight="fill" size={24} color='#472144' /> : <User size={24} color='grey' />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.tabBar}>
      {[
        { route: 'homeScreen', label: 'Home' },
        { route: 'Emergency', label: 'Emergency' },
        { route: 'userProfile', label: 'Profile' }
      ].map((tab, index) => (
        <Pressable
          key={index}
          onPress={handlePress(index, tab.route)}
          style={styles.button}
        >
          <View style={styles.iconContainer}>
            {getIcon(index)}
          </View>
          <Text style={getTextStyle(index)}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.2,
    borderTopColor: 'lightgrey',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    height: 60,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
  },
});
