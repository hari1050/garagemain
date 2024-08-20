import { StyleSheet, Animated, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import React from 'react';

const Pagination = ({ data, scrollX, index }) => {
  const width = responsiveWidth(87.5); // 100% of the screen width

  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [responsiveWidth(3), responsiveWidth(7.5), responsiveWidth(3)], // You can adjust these percentages
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.2, 1, 0.1],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#ccc', '#000', '#ccc'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              { width: dotWidth, backgroundColor, opacity:0.5 },
            ]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: responsiveWidth(1.5), // Adjusted for responsive sizing
    borderRadius: responsiveWidth(1.5), // Adjusted for responsive sizing
    marginHorizontal: responsiveWidth(0.75), // Adjusted for responsive sizing
    backgroundColor: '#ccc',
  },
});
