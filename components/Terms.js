import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Terms = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { name } = route.params;

    const navigateToProfile = () => {
        navigation.navigate('userProfile', { name: name });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigateToProfile}>
                    <CaretLeft />
                </TouchableOpacity>
                <Text style={styles.title}>Terms and Conditions</Text>
            </View>
            <Text style={styles.text}>
                Thank you for choosing our services. Please read the following terms and conditions carefully:
                {"\n\n"}
                1. Estimates provided are based on a subjective assessment of the repair condition and are subject to change after inspection.
                {"\n\n"}
                2. Free checkups are for inspection purposes only and do not include any repair services.
                {"\n\n"}
                3. Goods and Services Tax (GST) is applicable on all services provided.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '5%',
        backgroundColor: '#fff',
    },
    header: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: '5%',
    },
    title: {
        fontFamily: 'Satoshi-Bold',
        fontSize: windowHeight * 0.035, // 3.5% of window height
        color: '#2C152A', // Dark purple color
        textAlign: 'center',
        marginLeft: '5%', // Adjusted margin for alignment
    },
    text: {
        fontFamily: 'Satoshi-Medium',
        fontSize: windowHeight * 0.022, // 2.2% of window height
        lineHeight: windowHeight * 0.035, // 3.5% of window height
        textAlign: 'left',
        color: '#333', // Dark gray color
    },
});

export default Terms;
