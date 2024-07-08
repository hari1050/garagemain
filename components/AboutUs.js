import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AboutUs = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { name } = route.params;

    const navigateToProfile = () => {
        navigation.navigate('userProfile', { name: name });
    };

    return (
        <View style={styles.viewContainer}>
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigateToProfile}>
                    <CaretLeft />
                </TouchableOpacity>
                <Text style={styles.title}>About Us</Text>
            </View>
            <Text style={styles.text}>
                Thanks for downloading our app.
                {"\n\n"}
                We offer car servicing, maintenance, denting, and painting services at your fingertips.
                {"\n\n"}
                With over years of experience, we have been dedicated to providing valuable services to customers in the Virar to Naigaon region.
                {"\n\n"}
                Check out our periodic maintenance costs and start saving big!
                {"\n\n"}
                Feel free to call us for a free consultation.
                {"\n\n"}
                Emergency contacts: 9890135566
                {"\n\n"}
                Address:
                {"\n"}
                Classic Car Care,
                {"\n"}
                Besides Zeal 2 Restaurant,
                {"\n"}
                Arnala-Vasai Road, Bhuigaon,
                {"\n"}
                Vasai West - 401201
                {"\n"}
                Contact: Robert Correia - 9503602824
            </Text>
        </ScrollView>
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
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: '5%',
        backgroundColor: '#fff',
    },
    header: {
        marginTop:20,
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
        marginLeft: '20%', // Add margin to separate icon and text
    },
    text: {
        fontFamily: 'Satoshi-Medium',
        fontSize: windowHeight * 0.022, // 2.2% of window height
        lineHeight: windowHeight * 0.035, // 3.5% of window height
        textAlign: 'left',
        color: '#333', // Dark gray color
    },
});

export default AboutUs;
