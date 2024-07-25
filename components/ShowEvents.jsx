import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity, Alert, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { ipAddress } from "./ipAddress";
import { userType } from "./LoginScreen";
import { isLog } from "./HomeScreen";

export let eventNameJoin = "";

const PrintData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getDataFromServer();
    const interval = setInterval(() => {
      getDataFromServer();
    }, 2000); 
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, statusFilter, data]);

  const getDataFromServer = async () => {
    try {
      const response = await axios.get(`http://${ipAddress}:3000/getEvent`);
      const events = response.data;

      const eventsWithUserCounts = await Promise.all(events.map(async (event) => {
        try {
          const countResponse = await axios.get(`http://${ipAddress}:3000/getUserCount/${event.name}`);
          const userCount = countResponse.data.userCount;
          return { ...event, userCount };
        } catch (error) {
          console.error(`Error fetching user count for event ${event.name}:`, error);
          return { ...event, userCount: 0 };
        }
      }));

      setData(eventsWithUserCounts);
      setLoading(false);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (!data) return;

    let filtered = data;

    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const handlePress = () => {
    navigation.navigate("Add");
  };

  const handleEditEvent = (event) => {
    navigation.navigate("EditEvent", { event });
  };

  const handlePreviewEvent = (event) => {
    eventNameJoin = event.name;
    navigation.navigate("PreviewEvent", { event });
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://${ipAddress}:3000/deleteEvent/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas usuwania wydarzenia");
      }
      Alert.alert(
        "Sukces",
        "Wydarzenie zostało pomyślnie usunięte z bazy danych"
      );
      getDataFromServer();
    } catch (error) {
      console.error("Błąd podczas usuwania wydarzenia: ", error);
      Alert.alert("Błąd", "Wystąpił problem podczas usuwania wydarzenia");
    }
  };

  const handleArchiveEvent = async (event) => {
    try {
      const response = await fetch(
        `http://${ipAddress}:3000/updateEventStatus/${event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Zakończone" }),
        }
      );

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas archiwizacji wydarzenia");
      }

      setData(
        data.map((e) =>
          e.id === event.id ? { ...e, status: "Zakończone" } : e
        )
      );
      getDataFromServer();
    } catch (error) {
      console.error("Błąd podczas archiwizacji wydarzenia: ", error);
      Alert.alert("Błąd", "Wystąpił problem podczas archiwizacji wydarzenia");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Wyszukaj wydarzenie..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Picker
        selectedValue={statusFilter}
        style={styles.picker}
        onValueChange={(itemValue) => setStatusFilter(itemValue)}
      >
        <Picker.Item label="Aktywne" value="Aktywne" />
        <Picker.Item label="Zakończone" value="Zakończone" />
        <Picker.Item label="Wszystkie" value="" />
      </Picker>
      

      <View style={styles.WhiteBox}>
        {userType === "admin" && isLog === true && (
          <View style={styles.fixToText}>
            <TouchableOpacity onPress={() => navigation.navigate('Add')}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <View>
              {filteredEvents.map((event, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.whiteDiv,
                    event.status === "Zakończone" && styles.archivedDiv,
                  ]}
                  onPress={() => handlePreviewEvent(event)}
                >
                  <View style={styles.eventBox}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <View style={styles.gridContainer}>
                      <Image
                        style={styles.eventImage}
                        source={require("../Images/EI.png")}
                      />
                      <Text style={styles.eventDescription} numberOfLines={7} ellipsizeMode='tail'>
                        {event.description}
                      </Text>
                      <Text style={styles.eventStartDate}>
                        {event.startDate}
                        {`\n`}
                        {event.startTime}
                      </Text>
                      
                      <View style={styles.limitContainer}>
                      <Image
                        source={require("../Images/LimitMan.png")}
                      />                   
                      <Text style={styles.eventLimit}>
                        {event.userCount}/{event.maxLimit}
                      </Text>
                      </View> 
                    </View>
                  </View>
                  {userType === "admin" && event.status !== "Zakończone" && isLog === true && (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleArchiveEvent(event)}
                      >
                        <Image
                          source={require("../Images/ArchiveIcon.png")}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleEditEvent(event)}
                      >
                        <Image
                          source={require("../Images/EditIcon.png")}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleDeleteEvent(event.id)}
                      >
                        <Image
                          source={require("../Images/DeleteIcon.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text>Brak danych do wyświetlenia</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 30,
    overflow: 'hidden',
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    width: "95%",
  },
  picker: {
    height: "100",
    width: "95%",
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,    
  },
  whiteDiv: {
    flexGrow: 1,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 35,
    borderColor: "rgba(25, 25, 155, 0.5)",
  },
  WhiteBox: {
    width: '95%',
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 35,
  },
  archivedDiv: {
    backgroundColor: "#d3d3d3",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  fixToText: {
    flexDirection: 'row-reverse',
    position: 'static',
    width: "100%",
    height: "7%",
    backgroundColor: '#1D2E96',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignContent: "center",
  },
  plus: {
    fontSize: 40,
    marginRight: "3%",
    paddingBottom: "10%",
    color: '#FFFFFF',
  },
  eventBox: {
    padding: 10,
    paddingBottom: 0,
  },
  eventName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eventImage: {
    flexGrow: 0,
    flexShrink: 0,
    width: '48%',
    height: '70%',
    borderRadius: 10,
  },
  eventDescription: {
    width: '48%',
  },
  eventStartDate: {
    width: '48%',
    fontSize: 18,
  },
  eventstartTime: {
    width: '48%',
    fontSize: 18,
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyItems: 'end',
  },
  eventLimit: {
    fontSize: 25,
  },
});

export default PrintData;
