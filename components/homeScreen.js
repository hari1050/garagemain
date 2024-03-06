import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Dropdown } from "react-native-material-dropdown";
// import { Dropdown } from 'react-native-material-dropdown';


export default function homeScreen() {

    const navigation = useNavigation();
    const route = useRoute();
    const { name, carModels } = route.params;
    const [carPrices, setCarPrices] = useState([]);

    const navigateToClassicService = () => {
            navigation.navigate('classicService',{name:name});
    }

    const navigateToProfile = () => {
        navigation.navigate('homeScreen');
    }

    const navigateToEmergency = () => {
        navigation.navigate('homeScreen');
    }

    useEffect(() => {
        // Function to fetch prices based on carModels IDs
        const fetchPrices = async () => {
            try {
                const { data, error } = await supabase
                    .from('Car_Model_Joined')
                    .select('Service_cost')
                    .eq('Id', carModels.map(model => model.id)); // Fetch prices for car models IDs

                if (error) {
                    throw error;
                }

                // Update state with fetched prices
                setCarPrices(data);
            } catch (error) {
                console.error('Error fetching prices:', error.message);
            }
        };

        fetchPrices(); // Call fetchPrices function when component mounts
    }, [carModels]);


    return (
        <View style={styles.viewContainer}>

            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Hi {name}</Text>
                    <TouchableOpacity onPress={navigateToProfile}>
                        <Image
                            style={styles.profile}
                            source={require('../assets/profile.png')}
                        />
                    </TouchableOpacity>
                </View>
                {/* <Dropdown
            placeholder='Hyundai i20'
        /> */}
                {carModels.map((model, index) => (
                    <TouchableOpacity key={model.id} onPress={navigateToClassicService} style={styles.classicService}>
                        <Image source={require('../assets/classicService.png')} style={styles.classicServiceImg} />
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                {carPrices.length > 0 && carPrices[index] ? (
                                    <Text style={styles.priceText}>
                                        Rs. {carPrices[index].Service_cost}
                                    </Text>
                                ) : (
                                    <Text style={styles.priceText}>N/A</Text>
                                )}
                            </View>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.serviceText}>Classic Service</Text>
                                <Text style={styles.serviceDescription}>Lorem ipsum dolor sit amet consectetur. Faucibus lorem mi etiam.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.classicService}>
                    <Image source={require('../assets/summerService.png')} style={styles.summerServiceImg} />
                    <View style={styles.textOverlay}>
                        <View style={styles.priceTag}>
                            <Text style={styles.priceText}>Rs. 2999</Text>
                        </View>
                        <View style={styles.bottomTextContainer}>
                            <Text style={styles.serviceText}>Summer Service</Text>
                            <Text style={styles.serviceDescription}>Lorem ipsum dolor sit amet consectetur. Faucibus lorem mi etiam.</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.classicService}>
                    <Image source={require('../assets/monsoonService.png')} style={styles.summerServiceImg} />
                    <View style={styles.textOverlay}>
                        <View style={styles.priceTag}>
                            <Text style={styles.priceText}>Rs. 2999</Text>
                        </View>
                        <View style={styles.bottomTextContainer}>
                            <Text style={styles.serviceText}>Monsoon Service</Text>
                            <Text style={styles.serviceDescription}>Lorem ipsum dolor sit amet consectetur. Faucibus lorem mi etiam.</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.classicService}>
                    <Image source={require('../assets/winterService.png')} style={styles.summerServiceImg} />
                    <View style={styles.textOverlay}>
                        <View style={styles.priceTag}>
                            <Text style={styles.priceText}>Rs. 2999</Text>
                        </View>
                        <View style={styles.bottomTextContainer}>
                            <Text style={styles.serviceText}>Winter Service</Text>
                            <Text style={styles.serviceDescription}>Lorem ipsum dolor sit amet consectetur. Faucibus lorem mi etiam.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.customButton} onPress={navigateToEmergency}>
                    <Text style={styles.buttonText}>Emergency</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profile: {
        width: 40,
        height: 40,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    classicService: {
        paddingTop: 30
    },
    classicServiceImg: {
        borderRadius: 12,
        width: 345,
        height: 396,
    },
    summerServiceImg: {
        borderRadius: 12,
        width: 345,
        height: 240,
    },
    textOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        padding: 20,
    },
    bottomTextContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        padding: 20
    },
    priceTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#2C152A',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 26,
    },
    priceText: {
        fontSize: 16,
        color: '#fff'
    },
    serviceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'left',
    },
    serviceDescription: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
        textAlign: 'left',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#732753',
        textAlign: 'left',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    customButton: {
        backgroundColor: '#9B0E0E',
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
        bottom: 20,
        left: 18,
        right: 0,
    },
});