import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import Customloadingicon from './Customloadingicon'; // Import your custom loading indicator component
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


export default function homeScreen() {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [backPressCount, setBackPressCount] = useState(0);
    const [name, setName] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [carModels, setCarModels] = useState([]);
    const [carPrices, setCarPrices] = useState([]);
    const [pricesFetched, setPricesFetched] = useState(false); // Track if prices are fetched
    const [userDataLoaded, setUserDataLoaded] = useState(false); // Track if user data is loaded
    const [isLoading, setIsLoading] = useState(true); // Track if data is currently being loaded
    const [selectedCarIndex, setSelectedCarIndex] = useState(0);


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
        if(isFocused){
        const initializeUserData = async () => {
            setIsLoading(true); // Start loading
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);
                    console.log(userData.name)
                    setName(userData.name);
                    setCarModels(userData.carModels);
                    setPhoneNumber(userData.phonenumber);
                    setUserDataLoaded(true); // Set userDataLoaded to true after user data is loaded
                }
            } catch (error) {
                console.log("Error retrieving user data from AsyncStorage:", error);
            }
            setIsLoading(false); // End loading

        };
    
        initializeUserData();
        }
    }, [isFocused]); // Add userDataLoaded as a dependency
    

    useEffect(() => {
        const fetchPrices = async () => {
            setIsLoading(true); // Start loading
            try {
                console.log("sup")
                const carModelIds = carModels.map(model => model.id);
                const { data, error } = await supabase
                    .from('Car_Model_Joined')
                    .select('Service_cost')
                    .in('Id', carModelIds);

                if (error) {
                    throw error;
                }
                setCarPrices(data || []);
                setPricesFetched(true);
            } catch (error) {
                console.error('Error fetching prices:', error.message);
            }
            setTimeout(() => {
                setIsLoading(false); // End loading
            }, 100);
            setIsLoading(false); // End loading
        };

        if (userDataLoaded) {
            fetchPrices();
        }
    }, [userDataLoaded,carModels,setSelectedCarIndex]); // Fetch prices when carModels change

    const navigateToClassicService = () => {
        navigation.navigate('classicService', {carPrices: carPrices, servicetype: "Classicservice", selectedCarIndex: selectedCarIndex });
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
    
    const handleChangeCar = (itemIndex) =>{
        setSelectedCarIndex(itemIndex);
    }

    if (isLoading) {
        return <Customloadingicon />;
    }

    return (
        <View style={styles.viewContainer}>

            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Hi {name}</Text>
                    <TouchableOpacity onPress={navigateToProfile}>
                        <Image
                            style={styles.profile}
                            source={require('../assets/profile.png')}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.dropdownContainer}>
                    <Text>Select Car:</Text>
                    <Picker
                        selectedValue={selectedCarIndex}
                        onValueChange={(itemValue, itemIndex) =>
                            handleChangeCar(itemValue)
                        }>
                        {carModels.map((car, index) => (
                            <Picker.Item label={car.name} value={index} key={index} />
                        ))}
                    </Picker>
                </View>

                    {carModels.length > 0 && (
                        <TouchableOpacity key={carModels[0].id} onPress={navigateToClassicService} style={styles.classicService}>
                        <Image source={require('../assets/classicService.png')} style={styles.classicServiceImg} />
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                {carPrices.length > 0 ? (
                                    <Text style={styles.priceText}>
                                        {/* Rs. {carPrices.map(price => price.Service_cost).join(', ')} */}
                                        Rs. {carPrices[selectedCarIndex].Service_cost}
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
        width: '100%',
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
        fontFamily: 'Satoshi-Medium',
        fontSize: 16,
        color: '#fff'
    },
    serviceText: {
        fontFamily: 'Satoshi-Bold',
        fontSize: 22,
        color: '#fff',
        textAlign: 'left',
    },
    serviceDescription: {
        fontFamily: 'Satoshi-Medium',
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
        textAlign: 'left',
    },
    headerText: {
        fontFamily: 'Satoshi-Bold',
        fontSize: 22,
        color: '#732753',
        textAlign: 'left',
    },
    buttonText: {
        fontFamily: 'Satoshi-Medium',
        color: '#fff',
        fontSize: 18,
    },
    customButton: {
        alignSelf:'center',
        backgroundColor: '#9B0E0E',
        height: 54,
        width: '94%',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 8,
        paddingLeft: 24,
        paddingRight: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '5%',
    },
    dropdownContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
})