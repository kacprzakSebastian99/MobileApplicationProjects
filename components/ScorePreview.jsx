import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ipAddress } from './ipAddress';
import BackgroundTriangles from './BackgrountZUT';

const ScoreDetails = ({ route }) => {
    const { eventName, scoreDetails } = route.params;
    const { userName, rank } = scoreDetails;

    const [scoreDetailsState, setScoreDetailsState] = useState(null);
    const [loading, setLoading] = useState(true);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    useEffect(() => {
        const fetchScoreDetails = async () => {
            try {
                const response = await axios.get(`http://${ipAddress}:3000/getScoreDetails`, {
                    params: { eventName, userName }
                });
                setScoreDetailsState(response.data);
            } catch (error) {
                console.error('Błąd pobierania szczegółowych danych: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScoreDetails();
    }, [eventName, userName]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!scoreDetailsState) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Brak danych do wyświetlenia</Text>
            </View>
        );
    }

    const { score, time, url } = scoreDetailsState;

    return (
        <View style={{paddingVertical: "5%"}}>
            <BackgroundTriangles/>
            <View style={styles.root}>
                <Text style={{fontSize: 20}}>Uczestnik:</Text>
                <Text style={styles.input}>{userName}</Text>
                <Text style={{fontSize: 20}}>Miejsce:</Text>
                <Text style={[styles.input, {width: "30%"}]}>{rank}</Text>
                <Text style={{fontSize: 20}}>Wynik:</Text>
                <Text style={[styles.input, {width: "50%"}]}>{score}</Text>
                <Text style={{fontSize: 20}}>Czas:</Text>
                <Text style={styles.input}>{time}</Text>
                <Text style={{fontSize: 20}}>Zrzut ekranu z wynikiem</Text>
                {url ? (
                    <TouchableOpacity onPress={openModal}>
                        <Image
                            source={{ uri: `http://${ipAddress}:3000/${url.replace(/\\/g, '/')}` }}
                            style={[styles.imagePlaceholder, { width: windowWidth * 0.9 }]}
                        />
                    </TouchableOpacity>
                ) : (
                    <Text>Brak obrazu</Text>
                )}

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
                            <Image
                                source={{ uri: `http://${ipAddress}:3000/${url.replace(/\\/g, '/')}` }}
                                style={[styles.fullImage, { width: windowWidth, height: windowHeight }]}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
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
        paddingHorizontal: 20,
        paddingTop: 10,
        alignSelf: "center",
        marginVertical: "8%",
    },
    input: {
        height: "7%",
        borderRadius: 35,
        marginVertical: "1%",
        paddingVertical: "1%",
        width: "100%",
        backgroundColor: 'rgba(255, 255, 255, 1)',
        paddingLeft: 15,
        fontSize: 25,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        resizeMode: "contain",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imagePlaceholder: {
        aspectRatio: 16 / 9,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        alignSelf: "center",
    },
});

export default ScoreDetails;
