import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundTriangles from './BackgrountZUT';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ipAddress } from './ipAddress';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddEvent = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setstartTime] = useState('');
    const [maxLimit, setMaxLimit] = useState('');
    const [terms, setTerms] = useState('');
    const [status, setStatus] = useState('Aktywne');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const navigation = useNavigation();

    const addNew = async () => {
        try {
            const response = await fetch(`http://${ipAddress}:3000/addNewEvent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    startDate,
                    startTime,
                    maxLimit,
                    terms,
                    status,
                }),

            });
            if (!response.ok) {
                throw new Error('Wystąpił błąd podczas dodawania wydarzenia');
            }
            Alert.alert('Sukces', 'Utworzono wydarzenie.');
            setName('');
            setDescription('');
            setStartDate('');
            setstartTime('');
            setMaxLimit('');
            setTerms('');
            setStatus('');
            navigation.navigate("Home"); 
        } catch (error) {
            console.error('Błąd podczas przesyłania danych: ', error);
            Alert.alert('Błąd', 'Wystąpił problem podczas przesyłania danych');
        }
    };
    
    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
      const handleConfirm = (date) => {
        const formattedDate = date.toLocaleDateString();
        setStartDate(formattedDate);
        hideDatePicker();
      };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setstartTime(formattedTime);
        hideTimePicker();
    };


    return (
        <View>
        <BackgroundTriangles />
        <View style={[styles.root, { marginVertical: "5%" }]}>
        <ScrollView contentContainerStyle={{paddingBottom: "40%"}}>
            <SafeAreaView>
            <Text style={{ fontSize: 18 }}>Nazwa:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setName(text)}
                value={name}
            />
            <Text style={{ fontSize: 18 }}>Opis:</Text>
            <TextInput
                style={[styles.input, {height: "20%", borderRadius: 15}]}
                multiline
                numberOfLines={2}
                onChangeText={(text) => setDescription(text)}
                value={description}
            />
            <Text style={{ fontSize: 18 }}>Data wydarzenia:</Text>
            <TextInput
                style={styles.input}
                onPress={showDatePicker}
                value={startDate}
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <Text style={{ fontSize: 18 }}>Godzina startu wydarzenia:</Text>
            <TextInput
                style={styles.input}
                onPress={showTimePicker}
                value={startTime}
            />
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
            />
            <Text style={{ fontSize: 18 }}>Limit uczestników:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(int) => setMaxLimit(int)}
                value={maxLimit}
            />
            <Text style={{ fontSize: 18 }}>Warunki(opcjonalnie):</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setTerms(text)}
                value={terms}
            />
            <TouchableOpacity
                onPress={addNew}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        width: '95%',
        height: '95%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 35,
        paddingHorizontal:20,
        alignSelf: "center",
      },
    input: {
        height: "7%",
        borderRadius: 35,
        marginVertical: "2%",
        width: "90%",
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingLeft: 15,
        fontSize: 20,
        alignSelf: "center",
      },
      button: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        width: "90%",
        padding: 5,
        marginVertical: "5%",
        alignSelf: "center",
        borderRadius: 35,
        borderColor: "black",
        borderWidth: 2,
      },
      buttonText: {
        color: "#000000",
        fontWeight: "500",
        alignSelf: "center",
        fontSize: 24,
      },
});

export default AddEvent;
