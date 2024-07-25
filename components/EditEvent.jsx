import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundTriangles from './BackgrountZUT';
import { ipAddress } from './ipAddress';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const EditEvent = ({ route }) => {
    const { event } = route.params;
    const maxL = (event.maxLimit).toString();
  
    const [id, setId ] = useState(event.id) ;
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [startDate, setStartDate] = useState(event.startDate);
    const [startTime, setstartTime] = useState(event.startTime);
    const [maxLimit, setMaxLimit] = useState(maxL);
    const [terms, setTerms] = useState(event.terms);
    const [status, setStatus] = useState(event.status);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const navigation = useNavigation();

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


    const updateEvent = async () => {
        try {
            const response = await fetch(`http://${ipAddress}:3000/updateEvent/${id}`, {
                method: 'PUT',
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
                throw new Error('Failed to update event');
            }
            Alert.alert('Zaktualizowano dane wydarzenia.');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error updating event: ', error);
            Alert.alert('Error', 'Failed to update event');
        }
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
                    onChangeText={setName} 
                    value={name} />
                    <Text style={{ fontSize: 18 }}>Opis:</Text>
                    <TextInput 
                    style={[styles.input, {height: "20%", borderRadius: 15}]}
                    multiline
                    numberOfLines={2}
                    onChangeText={setDescription} 
                    value={description} />
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
                    onChangeText={setMaxLimit} 
                    value={maxLimit} />
                    <Text style={{ fontSize: 18 }}>Warunki (opcjonalnie):</Text>
                    <TextInput 
                    style={styles.input} 
                    onChangeText={setTerms} 
                    value={terms} />
                    <TouchableOpacity
                        onPress={updateEvent}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Zaktualizuj</Text>
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

export default EditEvent;
