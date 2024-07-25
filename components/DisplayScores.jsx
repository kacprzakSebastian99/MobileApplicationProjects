import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import BackgroundTriangles from './BackgrountZUT';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ipAddress } from './ipAddress';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DisplayScores = ({ route }) => {
    const { eventName } = route.params;
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch(`http://${ipAddress}:3000/getScoresWithImages/${eventName}`);
                const data = await response.json();
                setScores(data);
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        };

        fetchScores();
    }, [eventName]);

    return (
        <View>
            <BackgroundTriangles />
            <ScrollView>
                <SafeAreaView>
                    {scores.map((score, index) => (
                        <View key={index} style={styles.scoreContainer}>
                            <Text style={styles.label}>User: {score.userName}</Text>
                            <Text style={styles.label}>Score: {score.score}</Text>
                            <Text style={styles.label}>Time: {score.time}</Text>
                            {score.url && (
                                <Image source={{ uri: score.url }} style={styles.image} />
                            )}
                        </View>
                    ))}
                </SafeAreaView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scoreContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    image: {
        width: wp('90%'),
        height: hp('40%'),
        borderRadius: 10,
        marginTop: 10,
    },
});

export default DisplayScores;
