import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from "react-native";
import { ipAddress } from "./ipAddress";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { printToFileAsync } from "expo-print";
import BackgroundTriangles from "./BackgrountZUT";


const Scoreboard = ({ route, navigation }) => {
  const { eventName } = route.params;
  const [scores, setScores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredScores, setFilteredScores] = useState([]);
  const [averageScore, setAverageScore] = useState(null);
  const [totalScore, setTotalScore] = useState(null);

  useEffect(() => {
    fetchScores();
  }, [eventName]);

  useEffect(() => {
    filterScores();
  }, [searchQuery, scores]);

  const fetchScores = async () => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:3000/getScores/${eventName}`
      );
      setScores(response.data);
      if (response.data.length > 0) {
        setAverageScore(response.data[0].averageScore || 0);
        setTotalScore(response.data[0].totalScore || 0);
      }
    } catch (error) {
      console.error("Błąd pobierania wyników: ", error);
    }
  };

  const filterScores = () => {
    const filtered = scores.filter((score) =>
      score.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredScores(filtered);
  };

  const generatePdf = async () => {
    const html = `
            <html>
                <body>
                    <h1>Wyniki dla wydarzenia: ${eventName}</h1>
                    <p>Średni wynik: ${
                      averageScore !== null
                        ? averageScore.toFixed(2)
                        : "Brak danych"
                    }</p>
                    <p>Suma wyników: ${
                      totalScore !== null ? totalScore : "Brak danych"
                    }</p>
                    <ul>
                        ${filteredScores
                          .map(
                            (score, index) => `
                            <li>
                                ${index + 1}. ${score.userName} - Wynik: ${
                              score.score
                            }, Czas: ${score.time}
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </body>
            </html>
        `;

    try {
      const { uri } = await printToFileAsync({ html });
      const newPath = `${FileSystem.documentDirectory}${eventName}-results.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath);
      } else {
        Alert.alert("PDF zapisany", `PDF został zapisany w: ${newPath}`);
      }
    } catch (error) {
      console.error("Błąd generowania PDF: ", error);
    }
  };

  const handlePress = (item, index) => {
    navigation.navigate("ScoreDetails", {
      eventName,
      scoreDetails: {
        userName: item.userName,
        rank: index + 1,
      },
    });
  };

  return (
    <View style={{paddingVertical: "5%",}}>
      <BackgroundTriangles/>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={{paddingBottom: "10%"}}>
        <Text style={styles.header}>Statystyki</Text>
        <View style={styles.stats}>
          <Text style={{ fontSize: 25, fontWeight: "500" }}>Suma wyników:</Text>
          <Text style={{paddingLeft: 10, padding: 5, fontSize: 25, fontWeight: "500" }}>
             {totalScore !== null ? totalScore : "Brak wyników"}
          </Text>
          <Text style={{ fontSize: 25, fontWeight: "500" }}>Średni wynik:</Text>
          <Text style={{ paddingLeft: 10, padding: 5, fontSize: 25, fontWeight: "500"}}>
            {averageScore !== null ? averageScore.toFixed(2) : "Brak wyników"}
          </Text>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Wyszukaj uczestnika"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View>
        <View style={styles.podium}>
                <Text style={{ fontSize: 25, textAlign: "center", color: "#ffffff" }}>
                  Ranking
                </Text>
        </View>

        <View>
        {filteredScores.map((item, index) => {
          const positionStyle = (() => {
            const pos = index + 1;
            if (pos === 1) return styles.position1;
            if (pos === 2) return styles.position2;
            if (pos === 3) return styles.position3;
            if (pos > 3 && pos % 2 === 0) return styles.positionWhite;
            if (pos > 3 && pos % 2 !== 0) return styles.positionGrey;
          })();

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(item, index)}
            >
              <View style={positionStyle}>
                <Text>
                  {index + 1}. {item.userName}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        </View>
        </View>
        </ScrollView>
        <View style={styles.limitContainer}>
          <TouchableOpacity  
            style={styles.buttonDownload}
            onPress={generatePdf} >
            <Text style={styles.buttonText}>Pobierz wyniki w PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '95%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 35,
    paddingHorizontal:20,
    paddingTop: 10,
    alignSelf: "center",
    paddingBottom: 60,
  },
  stats: {
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 35,
    padding:20,
    alignSelf: "center",
  },
  header: {
    fontSize: 25,
    fontWeight: "500",
    marginBottom: 10,
    alignSelf: "center"
  },
  input: {
    height: "7%",
    borderRadius: 35,
    marginVertical: 10,
    width: "90%",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingLeft: 15,
    fontSize: 20,
    alignSelf: "center",
  },
  ranking: {
    width: "90%",
    height: "20%",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "rgba(25, 25, 155, 0)",
    borderRadius: 30,
    backgroundColor: "rgba(25, 25, 155, 0)",
    alignItems: "center", 
  },
  podium: {
    borderWidth: 5,
    borderColor: "rgba(25, 25, 155, 0)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#1D2E96",
  },
  position1: {
    borderWidth: 5,
    borderColor: "#E1C048",//"#D1B028",
    backgroundColor: "#E1C048", 
  },
  position2: {
    borderWidth: 5,
    borderColor: "#B1B1B1",
    backgroundColor: "#B1B1B1",
  },
  position3: {
    borderWidth: 5,
    borderColor: "#E19248",
    backgroundColor: "#E19248",
  },
  positionWhite: {
    borderWidth: 5,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
  },
  positionGrey: {
    borderWidth: 5,
    borderColor: "#C5C5C5",
    backgroundColor: "#C5C5C5",
  },
  buttonDownload: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: "90%",
    padding: 5,
    marginVertical: 5,
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
  limitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
});

export default Scoreboard;

