import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, BackHandler, FlatList } from 'react-native';
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
        if (isFocused) {
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
    }, [userDataLoaded, carModels, setSelectedCarIndex]); // Fetch prices when carModels change

    const navigateToClassicService = () => {
        navigation.navigate('classicService', { carPrices: carPrices, servicetype: "Classicservice", selectedCarIndex: selectedCarIndex });
    };

    const navigateToSummerService = () => {
        navigation.navigate('summerService', { name: name, carModels: carModels, carPrices: carPrices, phonenumber: phonenumber, servicetype: "Summerservice" });
    }

    const navigateToOtherService = () => {
        navigation.navigate('otherServices', { carPrices: carPrices, servicetype: "Classicservice", selectedCarIndex: selectedCarIndex });
    }

    const navigateToMonsoonService = () => {
        navigation.navigate('monsoonService', { name: name, carModels: carModels, carPrices: carPrices, phonenumber: phonenumber, servicetype: "Monsoonservice" });
    }

    const navigateToProfile = () => {
        navigation.navigate('userProfile', { name: name, phonenumber: phonenumber });
    };

    const navigateToEmergency = async () => {
        navigation.navigate('Emergency', { name: name, carModels: carModels, phonenumber: phonenumber });
    };

    const navigateToClutch = async () => {
        navigation.navigate('Clutch', { carPrices: carPrices, servicetype: "Clutch Service", selectedCarIndex: selectedCarIndex });
    };

    const navigateToEngine = async () => {
        navigation.navigate('Engine', { carPrices: carPrices, servicetype: "Engine Service", selectedCarIndex: selectedCarIndex });
    };

    const navigateToPainting = async () => {
        navigation.navigate('Painting', { carPrices: carPrices, servicetype: "Painting Service", selectedCarIndex: selectedCarIndex });
    };

    const navigateToSuspension = async () => {
        navigation.navigate('Suspension', { carPrices: carPrices, servicetype: "Suspension Service", selectedCarIndex: selectedCarIndex });
    };

    const handleChangeCar = (itemIndex) => {
        setSelectedCarIndex(itemIndex);
    }

    if (isLoading) {
        return <Customloadingicon />;
    }

    const images = [
        { image: require('../assets/clth.png'), onPress: navigateToClutch },
        { image: require('../assets/engine.png'), onPress: navigateToEngine },
        { image: require('../assets/paint.png'), onPress: navigateToPainting },
        { image: require('../assets/suspension.png'), onPress: navigateToSuspension },
    ];

    const Slideshow = () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const flatListRef = useRef(null);
        const scrollIntervalRef = useRef(null);
        const isUserScrollingRef = useRef(false);
    
        const startAutoScroll = () => {
            scrollIntervalRef.current = setInterval(() => {
                if (!isUserScrollingRef.current) {
                    setCurrentIndex((prevIndex) => {
                        const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
                        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
                        return nextIndex;
                    });
                }
            }, 2000);
        };
    
        const stopAutoScroll = () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    
        useEffect(() => {
            startAutoScroll();
            return () => stopAutoScroll();
        }, []);

        const getItemLayout = (data, index) => ({
            length: 345, // width of each image in pixels
            offset: 345 * index,
            index,
        });
    
        const handleScrollToIndexFailed = (info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
        };
    
        return (
            <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                scrollEnabled
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={handleScrollToIndexFailed}
                onTouchStart={() => {
                    isUserScrollingRef.current = true;
                    stopAutoScroll();
                }}
                onTouchEnd={() => {
                    isUserScrollingRef.current = false;
                    startAutoScroll();
                }}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
                    setCurrentIndex(index);
                }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={item.onPress} key={index}>
                        <Image source={item.image} style={styles.summerServiceImg} />
                    </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
            />
        );
    };
    
    

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
                    <Picker
                        selectedValue={selectedCarIndex}
                        onValueChange={(itemValue, itemIndex) =>
                            handleChangeCar(itemValue)
                        }>
                        {carModels.map((car, index) => (
                            <Picker.Item style={styles.dropdownpicker} label={car.name} value={index} key={index} />
                        ))}
                    </Picker>
                </View>
                {carModels.length > 0 && (
                    <TouchableOpacity key={carModels[0].id} onPress={navigateToClassicService} style={styles.classicService}>
                        <Image source={require('../assets/classicserviceDark.png')} style={styles.classicServiceImg} />
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                {carPrices.length > 0 ? (
                                    <Text style={styles.priceText}>
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
                <View style={styles.classicService}>
                    <Slideshow />
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.customButton} onPress={navigateToEmergency}>
                    <Text style={styles.buttonText}>Emergency Car Services</Text>
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
        alignSelf: 'center',
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
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 20,
    },

    dropdownpicker: {
        fontFamily: 'Satoshi-Medium',
        fontSize: 16,
    }
});
