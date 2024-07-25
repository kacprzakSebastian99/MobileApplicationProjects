import React from "react";
import { View, ScrollView, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ipAddress } from "./ipAddress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundTriangles from "./BackgrountZUT";

export let userNameJoin = "";
export let userId = "";
export let userType = "";

const LoginScreen = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [typ, setTyp] = useState();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const fetchDataFromServer = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:3000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          typ: typ,
        }),
      });
      if (!response.ok) {
        throw new Error("Nie udało się zalogować");
      }

      console.log(username);
      console.log(password);
      const data = await response.json();
      const typFromServer = data[0].typ;
      const id = data[0].id;
      await AsyncStorage.setItem("userType", typFromServer);
      console.log("ALL DATA", data);
      setTyp(typFromServer);
      setIsLoggedIn(true);
      console.log("zalogowano jako", username);
      console.log("TYP USERA", typFromServer);
      userNameJoin = username;
      userId = id;
      userType = typFromServer;
      navigation.navigate("Home");
    } catch (error) {
      console.error("Błąd logowania:", error);
    } finally {
      setLoading(false);
    }
  };

  const ZalogujPressed = () => {
    console.warn("zaloguj");
    setLoading(true);
    fetchDataFromServer();
  };

  const ZarejestrujPressed = () => {
    console.warn("zarejestruj");

    navigation.navigate("Register");
  };

  const ZapomnialesPressed = () => {
    console.warn("zapomniales");

    navigation.navigate("ForgotSend");
  };

  return (
    <View>
    <BackgroundTriangles/>
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.root}>
        <Text style={styles.title}>Logowanie</Text>
        <TextInput
          placeholder="Login"
          onChangeText={(text) => setUsername(text.replace(/\s/g, ""))}
          value={username}
          style={styles.input}
          />
        <TextInput 
          style={styles.input}
          placeholder="Haslo"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <Pressable onPress={ZapomnialesPressed} style={styles.forgotButton}>
          <Text style={{ fontWeight: "bold" }}>Nie pamiętasz hasła?</Text>
        </Pressable>
        <Pressable onPress={ZalogujPressed} style={styles.loginButton}>
        <Text style={styles.textButton}>Zaloguj</Text>
        </Pressable>
        <Text style={{ fontWeight: 'bold' }}>Nie masz konta?</Text>
        <Pressable onPress={ZarejestrujPressed} style={styles.loginButton}>
        <Text style={styles.textButton}>Zarejestruj się</Text>
        </Pressable>
      </View>
    </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    width: '95%',
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 35,
    padding:20,
    alignItems: "center",
    justifyContent: 'center',
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
  WhiteBox: {
    width: '95%',
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 35,
    overflow: 'hidden',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: '40%',
    alignItems: "center",
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
  forgotButton: {
    flexDirection: 'row-reverse',
    marginVertical: 10,
    justifyItems: 'end',
    width: "90%",
  },
});
