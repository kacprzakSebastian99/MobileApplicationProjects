import React from "react";
import { View, ScrollView, Text, StyleSheet, Alert, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ipAddress } from "./ipAddress";
import BackgroundTriangles from "./BackgrountZUT";

const RegistrationScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const navigation = useNavigation();

  const ZarejestrujPressed = async () => {
    console.warn("zarejestruj");
    try {
      const response = await axios.post(`http://${ipAddress}:3000/register`, {
        username,
        email,
        password,
        passwordRepeat,
      });
      if (response.status !== 200) {
        throw new Error("Wystąpił błąd podczas dodawania danych");
      }
      Alert.alert("Sukces", "Dane zostały pomyślnie dodane do bazy danych");
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordRepeat("");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Błąd podczas przesyłania danych:", error);
      Alert.alert("Błąd", "Wystąpił problem podczas dodawania danych");
    }
  };

  return (
    <View>
      <BackgroundTriangles/>      
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.root}>
          <Text style={styles.title}>Rejestracja</Text>
          <TextInput 
            style={styles.input}
            placeholder="Login"
            onChangeText={(text) => setUsername(text.replace(/\s/g, ""))}
            value={username}
          />
          <TextInput 
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text.replace(/\s/g, ""))}
            value={email}
          />
          <TextInput 
            style={styles.input}
            placeholder="Haslo"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
          <TextInput 
            style={styles.input}
            placeholder="Powtórz hasło"
            onChangeText={(text) => setPasswordRepeat(text)}
            value={passwordRepeat}
            secureTextEntry={true}
          />
          <Pressable onPress={ZarejestrujPressed} style={styles.loginButton}>
            <Text style={styles.textButton}>Zarejestruj</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
export default RegistrationScreen;

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '95%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 35,
    padding:20,
    alignItems: "center",
    justifyContent: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: '45%',
    alignItems: "center",
  },
  input: {
    height: "10%",
    borderRadius: 35,
    marginVertical: 5,
    width: "90%",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingLeft: 15,
    fontSize: 20,
  },
  title: {
    color: "#000000",
    fontSize: 32,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: "90%",
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 35,
    borderColor: "black",
    borderWidth: 2,
  },
  textButton: { 
    fontWeight: "bold",
    fontSize: 24,
   },
});
