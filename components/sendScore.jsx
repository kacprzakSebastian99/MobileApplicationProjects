import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import BackgroundTriangles from './BackgrountZUT';
import * as ImagePicker from 'expo-image-picker';
import { ipAddress } from './ipAddress';
import { userNameJoin } from './LoginScreen'; 

const SendScores = ({ route }) => {
    const { eventName } = route.params;
    const [score, setScore] = useState('');
    const [time, setTime] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const selectImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission to access media library is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });
        if (pickerResult.cancelled === true) {
            return;
        }
        setImageUri(pickerResult.assets[0].uri);
    };

    const sendResults = async () => {
        try {
            if (!score) {
                Alert.alert('Please fill score.');
                return;
            }
            if (!time) {
                Alert.alert('Please fill time.');
                return;
            }
            if (!imageUri) {
                Alert.alert('Please fill image.');
                return;
            }

            const formData = new FormData();
            formData.append('eventName', eventName);
            formData.append('userName', userNameJoin);
            formData.append('score', score);
            formData.append('time', time);
            formData.append('image', {
                uri: imageUri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch(`http://${ipAddress}:3000/sendScores`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const responseData = await response.text();
            console.log('Server response:', responseData);

            if (!response.ok) {
                throw new Error('Error sending scores.');
            }

            Alert.alert('Success', 'Scores sent successfully.');
            setScore('');
            setTime('');
            setImageUri(null);
        } catch (error) {
            console.error('Error sending scores: ', error);
            Alert.alert('Error', 'An error occurred while sending scores.');
        }
    };

    return (
        <View style={{alignItems: "center",}}>
            <BackgroundTriangles />
            <View style={styles.root}>
                <Text style={styles.label}>Wynik:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setScore(text)}
                    value={score}
                />
                <Text style={styles.label}>Czas:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setTime(text)}
                    value={time}
                />
                <Text style={styles.label}>Zrzut ekranu z wynikiem:</Text>
                <TouchableOpacity onPress={selectImage} style={{height: "55%"}}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.imageImput} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text>Select Image</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={sendResults} style={styles.button}>
                    <Text style={styles.textButton}>Prześlij</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        width: '95%',
        height: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 35,
        padding:20,
        marginVertical: "9%",
    },
    input: {
        height: "7%",
        borderRadius: 35,
        marginVertical: 5,
        width: "90%",
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingLeft: 15,
        fontSize: 20,
    },
    label: {
        marginBottom: 5,
        fontSize: 20,
    },
    image: {
        width: 200,
        height: 200,
    },
    imageImput: {
        width: '100%',
        height: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
    },
    imagePlaceholder: {
        width: '100%',
        height: '60%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        width: "90%",
        height: "10%",
        marginTop: 5,
        alignSelf: "center",
        borderRadius: 35,
        borderColor: "black",
        borderWidth: 2,
      },
      textButton: { 
        fontWeight: "bold",
        fontSize: 24,
        marginVertical: "3%",
        alignSelf: "center",
       },
});

export default SendScores;
