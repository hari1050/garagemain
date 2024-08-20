import React, { useState, useEffect, useRef } from 'react';
import {Animated, ImageBackground, Dimensions, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, BackHandler, FlatList } from 'react-native';
import Customloadingicon from './Customloadingicon'; // Import your custom loading indicator component
import {LinearGradient} from "expo-linear-gradient"
import Pagination from './Pagination';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import supabase from '../supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { Linking } from 'react-native';
import { WhatsappLogo } from 'phosphor-react-native';

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
    const screenWidth = Dimensions.get('window').width;

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
                const carModelIds = carModels.map(model => model.id);
    
                // Map car model IDs to prices, defaulting to 5500 for null IDs
                const prices = carModelIds.map(id => ({
                    Id: id,
                    Service_cost: id === null ? "5,500.00" : null
                }));
    
                const validCarModelIds = carModelIds.filter(id => id !== null);
    
                if (validCarModelIds.length > 0) {
                    const { data, error } = await supabase
                        .from('Car_Model_Joined')
                        .select('Id, Service_cost')
                        .in('Id', validCarModelIds);
    
                    if (error) {
                        throw error;
                    }
    
                    // Update prices with fetched data
                    data.forEach(item => {
                        const price = prices.find(price => price.Id === item.Id);
                        if (price) {
                            price.Service_cost = item.Service_cost;
                        }
                    });
                }
    
                setCarPrices(prices);
                setPricesFetched(true);
            } catch (error) {
                console.error('Error fetching prices, defaulting to 5500:', error.message);
                // If there's an error, default all prices to 5500
                setCarPrices(carModels.map(model => ({ Id: model.id, Service_cost: 5500 })));
            }
            setIsLoading(false); // End loading
        };
    
        if (userDataLoaded) {
            fetchPrices();
        }
    }, [userDataLoaded, carModels, setSelectedCarIndex]);
    

    const navigateToClassicService = () => {
        navigation.navigate('classicService', { carPrices: carPrices, servicetype: "Classicservice", selectedCarIndex: selectedCarIndex });
    };

    // const navigateToProfile = () => {
    //     navigation.navigate('userProfile', { name: name, phonenumber: phonenumber });
    // };

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


    //Images link will expire on 10 July 2028
    const images = [
        {
            // image: { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/clth.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvY2x0aC5wbmciLCJpYXQiOjE3MjA1ODY2MzUsImV4cCI6MTg0NjczMDYzNX0.BFWzDSMjG5GmCQgyEnVAW6fjXLsWjKCIdnUVw19ZxNE&t=2024-07-10T04%3A43%3A55.742Z' },
            image: require ('../assets/clutch work.jpg'),
            title: "Clutch Work",
            description: "Book a free consultation for replacing clutch and get huge discounts on quotes",
            onPress: navigateToClutch
        },
        {
            // image: { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/engine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvZW5naW5lLnBuZyIsImlhdCI6MTcyMDU4Njg1NSwiZXhwIjoxODQ2NzMwODU1fQ.zW4U1SUy0Sde4T_AhRcWIzK0q7ljxtSvFnloy70ChXE&t=2024-07-10T04%3A47%3A35.394Z' },
            image: require ('../assets/Engine work.jpg'),
            title: "Engine work",
            description: "150+ engines repaired and restored. Book a free inspection session with our experts.",
            onPress: navigateToEngine
        },
        {
            //image: { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/paint.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvcGFpbnQucG5nIiwiaWF0IjoxNzIwNTg2ODk5LCJleHAiOjE4NDY3MzA4OTl9.ATdRM5TPvPEKfMMlFWHTlEv2f2QHTRsczG3flIf4lAQ&t=2024-07-10T04%3A48%3A19.749Z' },
            image: require ('../assets/Painting.jpg'),
            title: "Painting and Dent fix",
            description: "200+ cars painted. Best rates, quality products and quick service on denting and painting. Book a free inspection and estimate visit now.",
            onPress: navigateToPainting
        },
        {
            //image: { uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/suspension.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2Uvc3VzcGVuc2lvbi5wbmciLCJpYXQiOjE3MjA1ODY5MTcsImV4cCI6MTg0NjczMDkxN30.EuizHbJDm90zb_YLwcRd5k16BQAhCHcogKkJTTUVOqA&t=2024-07-10T04%3A48%3A37.893Z' },
            image: require ('../assets/Suspension work.jpg'),
            title: "Suspension Work",
            description: "Suspension trouble or noise, get it replaced at fantastic rates book a free inspection now.",
            onPress: navigateToSuspension
        },
    ];

    const Slideshow = () => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const flatListRef = useRef(null);
        const scrollIntervalRef = useRef(null);
        const isUserScrollingRef = useRef(false);
        const scrollX = useRef(new Animated.Value(0)).current;

    
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
            length: screenWidth*0.5, // width of each image in pixels
            offset: screenWidth * index,
            index,
        });
    
        const handleScrollToIndexFailed = (info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
        };
        const handleOnScroll = event => {
            Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              {
                useNativeDriver: false,
              },
            )(event);
          };
    
        return (
            <View>
            <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                style= {{width: responsiveWidth(87.5), height: responsiveHeight(35)}}
                pagingEnabled
                scrollEnabled
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}
                onScroll={handleOnScroll}
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
                        <ImageBackground source={item.image} imageStyle={{ borderRadius: 12 }} style={{ width: responsiveWidth(87.5), height: responsiveHeight(35)}}>
                            <LinearGradient 
                                colors={["#00000000", "#000000"]} 
                                style={{height : "100%", width : "100%", borderRadius: 12}}>
                            </LinearGradient>
                        </ImageBackground>
                        <View style={styles.textOverlay}>
                        <View style={styles.bottomTextContainer}>
                            <Text style={styles.serviceText}>{item.title}</Text>
                            <Text style={styles.serviceDescription}>{item.description}</Text>
                        </View>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
            />
            <Pagination data={images} scrollX={scrollX} index={currentIndex} />
            </View>
        );
    };
    
    

    return (
        <View style={styles.viewContainer}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Hi {name}</Text>
                    {/* <TouchableOpacity onPress={navigateToProfile}>
                        <Image
                            style={styles.profile}
                            source={require('../assets/profile.png')}
                        />
                    </TouchableOpacity> */}
                </View>

                <View style={styles.dropdownContainer}>
                    <Picker
                        selectedValue={selectedCarIndex}
                        onValueChange={(itemValue, itemIndex) =>
                            handleChangeCar(itemValue)
                        }>
                        {carModels.length > 0 && carModels.map((car, index) => (
                            <Picker.Item style={styles.dropdownpicker} label={car.name} value={index} key={index} />
                        ))}
                    </Picker>
                </View>
                {carModels.length > 0 && (
                    <TouchableOpacity key={carModels[0].id} onPress={navigateToClassicService} style={styles.classicService}>
                        <ImageBackground
                        style={styles.classicServiceImg}
                        imageStyle={{ borderRadius: 12 }}
                        source={require('../assets/classicservice.jpg')}
                        // source={{ uri: 'https://ccvfzxopmskzeegxucms.supabase.co/storage/v1/object/sign/imgForGarage/classicserviceDark.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWdGb3JHYXJhZ2UvY2xhc3NpY3NlcnZpY2VEYXJrLnBuZyIsImlhdCI6MTcyMDU4NzAyOSwiZXhwIjoxODQ2NzMxMDI5fQ.55OQEYI7_tuIRDX__sjXgBcV7ywJAGe2rt4m44zEKMI&t=2024-07-10T04%3A50%3A29.958Z' }} 
                        >
                            <LinearGradient 
                                colors={["#00000000", "#000000"]} 
                                style={{height : "100%", width : "100%",borderRadius: 12}}>
                            </LinearGradient>
                        </ImageBackground>
                        <View style={styles.textOverlay}>
                            <View style={styles.priceTag}>
                                {carModels[selectedCarIndex].id != null ? (
                                    <Text style={styles.priceText}>
                                        Rs. {carPrices[selectedCarIndex].Service_cost}
                                    </Text>
                                ) : (
                                    <Text style={styles.priceText}>Starts from Rs. 4,000</Text>
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
                <TouchableOpacity 
                    style={styles.whatsappButton} 
                    onPress={() => {
                    Linking.openURL(`whatsapp://send?phone=+919890135566&text=Hi Classic Car Care!`);
                    }}
                >
                <WhatsappLogo size={32} weight="fill"></WhatsappLogo>
                
                </TouchableOpacity>

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
        width: responsiveWidth(87.5),
        height: responsiveHeight(50),
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
        padding: 10
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
    },
    whatsappButton: {
        zIndex:1,
        position: 'absolute',
        bottom: 20, 
        right: 30,
        backgroundColor: '#25D366', 
        borderRadius: 50,
        padding: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1.2,
        shadowRadius: 4,
    },
});
