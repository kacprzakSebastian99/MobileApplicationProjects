import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import JoinToEvent from "./JoinToEvent";
import LeaveEvent from "./LeaveEvent";
import BackgroundTriangles from "./BackgrountZUT";
import { userNameJoin, userType } from "./LoginScreen";
import { ipAddress } from "./ipAddress";
import { isLog } from "./HomeScreen";


const PreviewEventUser = ({ route }) => {
  const { event } = route.params;
  const navigation = useNavigation();

  const [id, setId] = useState(event.id);
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [startDate, setStartDate] = useState(event.startDate);
  const [startTime, setstartTime] = useState(event.startTime);
  const [maxLimit, setMaxLimit] = useState(event.maxLimit);
  const [status, setStatus] = useState(event.status);
  const [isJoined, setIsJoined] = useState(false);
  const [userCount, setUserCount] = useState(event.userCount);

  useEffect(() => {
    if (userType == "user") { // zmiana
      checkIfUserIsJoined();
    }    
    fetchUserCount();
  }, []);

  const checkIfUserIsJoined = async () => {
    try {
      const response = await fetch(
        `http://${ipAddress}:3000/getusers/${event.name}`
      );
      const eventData = await response.json();
      console.log("Dane z bazy:", eventData);
      const isUserJoined = eventData.some(
        (user) => user.userName === userNameJoin
      );
      console.log(isUserJoined);
      setIsJoined(isUserJoined);
    } catch (error) {
      console.error(
        "Błąd podczas sprawdzania zapisanych użytkowników: ",
        error
      );
      setIsJoined(false);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch(
        `http://${ipAddress}:3000/getUserCount/${event.name}`
      );
      const data = await response.json();
      setUserCount(data.userCount);
    } catch (error) {
      console.error("Błąd podczas pobierania liczby użytkowników: ", error);
    }
  };

  const handleJoinToEvent = async () => {
    try {
      await JoinToEvent();
      setIsJoined(true);
      fetchUserCount();
    } catch (error) {
      console.error("Błąd podczas zapisywania się na wydarzenie: ", error);
      Alert.alert(
        "Błąd",
        "Wystąpił problem podczas zapisywania się na wydarzenie"
      );
    }
  };

  const handleLeaveEvent = async () => {
    try {
      await LeaveEvent(event.name, userNameJoin);
      setIsJoined(false);
      fetchUserCount();
    } catch (error) {
      console.error("Błąd podczas wypisywania się z wydarzenia: ", error);
      Alert.alert(
        "Błąd",
        "Wystąpił problem podczas wypisywania się z wydarzenia"
      );
    }
  };

  const handleButtonPress = () => {
    if (isJoined) {
      handleLeaveEvent();
    } else {
      handleJoinToEvent();
    }
  };

  const handleSendScorePress = () => {
    navigation.navigate("SendScore", {
      eventName: name,
      userName: userNameJoin,
    });
  };

  return (
    <View style={{ alignItems: 'center', paddingVertical: "5%"}}>
      <BackgroundTriangles />
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>         
          <Image
            style={styles.eventImage}
            source={require("../Images/EI.png")}
          />
          <Text style={{ fontSize: 35 }}>{name}</Text>
          <View style={{flexDirection: "row", columnGap: 100}}> 
          <Text style={{ marginVertical: "1%", fontSize: 22, fontWeight: "500", color: "blue"}}>{startDate}</Text>
          <Text style={{ marginVertical: "1%",fontSize: 22, fontWeight: "500", color: "blue"}}>{startTime}</Text>
          </View>
          <Text style={{ fontSize: 25 }}>{description}</Text>
          { userType == "user" && isJoined && status !== "Zakończone" && isLog === true && ( // zmiana
            <TouchableOpacity
              style={styles.buttonScore}
              onPress={handleSendScorePress}
            >
              <Text style={{ fontSize: 24, fontWeight: "500"  }}>Prześlij wyniki</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("Ranking", { eventName: name })}
          >
            <View style={styles.ranking}>
              <View style={styles.podium}>
                <Text style={{ fontSize: 25, textAlign: "center", color: "#ffffff" }}>
                  Ranking
                </Text>
                <View style={styles.position1}>
                  <Text style={{ paddingLeft: 15, fontSize: 20, fontWeight: "500" }}>
                    1. jk2347
                  </Text>
                </View>
                <View style={styles.position2}>
                  <Text style={{ paddingLeft: 15, fontSize: 20, fontWeight: "500" }}>
                    2. kk1287
                  </Text>
                </View>
                <View style={styles.position3}>
                  <Text style={{ paddingLeft: 15, fontSize: 20, fontWeight: "500" }}>
                    3. js2345
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.limitContainer}>
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            justifyItems: 'end', }}>
          <Text style={{ fontSize: 25 }}>
            {userCount}/{maxLimit}
          </Text>
          <Image
            style={{marginLeft: 5 }}
            source={require("../Images/LimitMan.png")}
          />  
          </View>          
          { userType == "user" && status !== "Zakończone" && isLog === true && (
            <>
              {isJoined ? (
                <TouchableOpacity
                  style={styles.buttonJoinLeft}
                  onPress={handleButtonPress}
                >
                  <Text style={styles.buttonText}>Wypisz</Text>
                </TouchableOpacity>
              ) : userCount < maxLimit ? (
                <TouchableOpacity
                  style={styles.buttonJoinLeft}
                  onPress={handleButtonPress}
                >
                  <Text style={styles.buttonText}>Zapisz</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.limitReachedText}>Osiągnięto limit</Text>
              )}
            </>
          )}
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
    padding:10,
    paddingBottom: 55,
    paddingVertical: '5%',
    alignItems: "center",
    justifyContent: 'center',
  },
  limitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  eventImage: {
    width: '90%',
    height: '25%',
    borderRadius: 30,
  },
  limitReachedText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: "60%",
    alignItems: "center",
  },
  ranking: {
    width: wp("90%"),
    height: hp("20%"),
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "rgba(25, 25, 155, 0)",
    borderRadius: 30,
    backgroundColor: "rgba(25, 25, 155, 0)",
    alignItems: "center", 
  },
  podium: {
    width: "95%",
    height: "25%",
    borderWidth: 0,
    borderColor: "rgba(25, 25, 155, 0)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#1D2E96",
  },
  position1: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#E1C048",
    backgroundColor: "#E1C048", 
  },
  position2: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#C5C5C5",
    backgroundColor: "#C5C5C5",
  },
  position3: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#E19248",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#E19248",
  },
  buttonJoinLeft: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: "40%",
    padding: 5,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 35,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonScore: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: "90%",
    padding: 5,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 35,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 24,
  },
});

export default PreviewEventUser;
