import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler, ActivityIndicator } from 'react-native';
import Customloadingicon from './Customloadingicon'; // Import your custom loading indicator component
import { useNavigation, useRoute } from '@react-navigation/native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function homeScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [backPressCount, setBackPressCount] = useState(0);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [name, setName] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [servicetype, setServiceType] = useState('');
    const [carModels, setCarModels] = useState([]);
    const [carPrices, setCarPrices] = useState([]);
    const [pricesFetched, setPricesFetched] = useState(false); // Track if prices are fetched
    const [userDataLoaded, setUserDataLoaded] = useState(false); // Track if user data is loaded


    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            setBackPressCount(prevCount => prevCount + 1);
            if (backPressCount >= 2) {
              BackHandler.exitApp();
            }
            return true; // Prevent default back button behavior
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          };
        }, [backPressCount]) // Include backPressCount in the dependency array
     );


    useEffect(() => {
        const initializeUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);
                    console.log(userData.carModels);
                    setName(userData.name);
                    setCarModels(userData.carModels);
                    setPhoneNumber(userData.phonenumber);
                    setUserDataLoaded(true); // Set userDataLoaded to true after user data is loaded
                }
            } catch (error) {
                console.log("Error retrieving user data from AsyncStorage:", error);
            }
        };

        initializeUserData();
    }, [triggerFetch]); // Add triggerFetch as a dependency

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const carModelIds = carModels.map(model => model.id);
                const { data, error } = await supabase
                    .from('Car_Model_Joined')
                    .select('Service_cost')
                    .in('Id', carModelIds);

                if (error) {
                    throw error;
                }
                setTimeout(() => {
                    setCarPrices(data || []);
                    setPricesFetched(true); // Set pricesFetched to true after prices are fetched
                }, 100);
            } catch (error) {
                console.error('Error fetching prices:', error.message);
            }
        };

        if (userDataLoaded) {
            fetchPrices();
        }
    }, [userDataLoaded,carModels]); // Fetch prices when carModels change

    const navigateToClassicService = () => {
        navigation.navigate('classicService', { name: name, carModels: carModels, carPrices: carPrices, phonenumber: phonenumber, servicetype: "Classicservice" });
    };

    const navigateToSummerService = () => {
        navigation.navigate('summerService',{ name: name, carModels: carModels, carPrices: carPrices, phonenumber: phonenumber, servicetype:"Summerservice" });
    }

    const navigateToWinterService = () => {
        navigation.navigate('winterService',{ name: name, carModels: carModels, carPrices: carPrices, phonenumber: phonenumber, servicetype:"Winterservice" });
    }

    const navigateToMonsoonService = () => {
        navigation.navigate('monsoonService',{ name: name, carModels: carModels, carPrices: carPrices, phonenumber: phonenumber, servicetype:"Monsoonservice" });
    }

    const navigateToProfile = () => {
        navigation.navigate('userProfile', { name: name, phonenumber: phonenumber });
    };

    const navigateToEmergency = async () => {
        navigation.navigate('Emergency',{name:name, carModels:carModels, phonenumber:phonenumber});
    };

    if (!pricesFetched || !userDataLoaded) {
        return <Customloadingicon />;
    }

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

                    {carModels.length > 0 && (
                        <TouchableOpacity key={carModels[0].id} onPress={navigateToClassicService} style={styles.classicService}>
                        <Image source={require('../assets/classicService.png')} style={styles.classicServiceImg} />
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                {carPrices.length > 0 ? (
                                    <Text style={styles.priceText}>
                                        Rs. {carPrices.map(price => price.Service_cost).join(', ')}
                                    </Text>
                                ) : (
                                    <Text style={styles.priceText}>N/A</Text>
                                )}
                            </View>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.serviceText}>Classic Service</Text>
                                <Text style={styles.serviceDescription}>A package that makes you car ready for road trips, 6+ months of daily use or ready for any occasion with regular maintenance.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* <TouchableOpacity onPress={navigateToSummerService}>
                    <View style={styles.classicService}>
                        <Image source={require('../assets/summerService.png')} style={styles.summerServiceImg} />
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                <Text style={styles.priceText}>Rs. 2999</Text>
                            </View>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.serviceText}>Summer Service</Text>
                                <Text style={styles.serviceDescription}>Free Ice pack and some accessory related to keeping drinks cool</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToMonsoonService}>
                    <View style={styles.classicService}>
                        <Image source={require('../assets/monsoonService.png')} style={styles.summerServiceImg} />
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                <Text style={styles.priceText}>Rs. 2999</Text>
                            </View>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.serviceText}>Monsoon Service</Text>
                                <Text style={styles.serviceDescription}>Free, anti-fog window treatment and CCC branded umbrella.</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToWinterService}>
                    <View style={styles.classicService}>
                        <Image source={require('../assets/winterService.png')} style={styles.summerServiceImg} />
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                <Text style={styles.priceText}>Rs. 2999</Text>
                            </View>
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.serviceText}>Winter Service</Text>
                                <Text style={styles.serviceDescription}>Free hot chocolate drink.</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity> */}
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
        paddingTop: 30,
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
        alignSelf:'center',
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
        // paddingTop: 16,
        // paddingBottom: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        bottom: 20,
    },
})