import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BatteryWarningVertical, PoliceCar, ChargingStation, Key, SteeringWheel, Engine, Drop, Rows, CaretLeft } from "phosphor-react-native";
import { useNavigation, useRoute } from '@react-navigation/native';


export default function Emergency(){
    const navigation = useNavigation();
    const route = useRoute();
    const { name, carModels } = route.params;
    const navigateToHome = () => {
        navigation.navigate('homeScreen',{name: name, carModels: carModels});
    }

    return(
        <View style={styles.viewContainer}>
            <ScrollView>
                <TouchableOpacity style={styles.caretLeft} onPress={navigateToHome}>
                    <CaretLeft></CaretLeft>
                </TouchableOpacity>
                <View style={styles.individualTopic}>
                    <BatteryWarningVertical size={32} weight="fill"></BatteryWarningVertical>
                    <Text style={styles.iconLabel}>Battery discharged</Text>
                </View>
                <View style={styles.individualTopic}>
                    <PoliceCar size={32} weight="fill"></PoliceCar>
                    <Text style={styles.iconLabel}>Accident</Text>
                </View>
                <View style={styles.individualTopic}>
                    <ChargingStation size={32} weight="fill"></ChargingStation>
                    <Text style={styles.iconLabel}>Fuel Problem</Text>
                </View>
                <View style={styles.individualTopic}>
                    <Key size={32} weight="fill"></Key>
                    <Text style={styles.iconLabel}>Lost/Locked Key</Text>
                </View>
                <View style={styles.individualTopic}>
                    <SteeringWheel size={32} weight="fill"></SteeringWheel>
                    <Text style={styles.iconLabel}>Flat Tire</Text>
                </View>
                <View style={styles.individualTopic}>
                    <Engine size={32} weight="fill"></Engine>
                    <Text style={styles.iconLabel}>Engine Overheating</Text>
                </View>
                <View style={styles.individualTopic}>
                    <Drop size={32} weight="fill"></Drop>
                    <Text style={styles.iconLabel}>Coolant Leakage</Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    caretLeft: {
        marginTop:10,
        marginLeft: 20
    },
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    individualTopic: {
        flexDirection:'row',
        padding: 36,
        alignItems:'center',
        justifyContent:'left'
    },
    iconLabel:{
        fontSize:18,
        marginLeft:8
    }

});