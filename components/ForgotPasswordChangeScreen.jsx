import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ipAddress } from "./ipAddress";
import BackgroundTriangles from "./BackgrountZUT";

const ForgotPasswordChangeScreen = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const navigation = useNavigation();

  const ZmienPressed = async () => {
    console.warn("zmiana hasla");
    if (password == passwordRepeat) {
      try {
        const response = await fetch(`http://${ipAddress}:3000/change`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            newPassword: password,
          }),
        });
        if (response.ok) {
          Alert.alert("Hasło zostało pomyślnie zmienione.");
          navigation.navigate("Login");
        } else {
          const data = await response.json();
          Alert.alert("Wystąpił błąd podczas zmiany hasła.", data.message);
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania żądania:", error);
        Alert.alert("Wystąpił błąd podczas zmiany hasła.");
      }
    } else {
      Alert.alert("Błąd", "hasla musza byc takie same");
    }
  };

  const WyslijPressed = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:3000/sendCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert("Kod został wysłany ponownie.");
      } else {
        Alert.alert("Wystąpił błąd podczas wysyłania kodu.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania kodu:", error);
      Alert.alert("Wystąpił błąd podczas wysyłania kodu.");
    }
  };

  return (
    <View>
      <BackgroundTriangles />
      <View>
        <View style={styles.info}>
          <Text style={styles.text}>
            Na twój email został wysłany kod potrzebny do zmiany hasła.
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.root}>
            <TextInput
              style={styles.input}
              placeholder="Kod"
              onChangeText={(text) => setCode(text)}
              value={code}
            />
            <TextInput
              style={styles.input}
              placeholder="Nowe hasło"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Powtórz nowe hasło"
              onChangeText={(text) => setPasswordRepeat(text)}
              value={passwordRepeat}
              secureTextEntry={true}
            />
            <Pressable onPress={ZmienPressed} style={styles.loginButton}>
              <Text style={styles.textButton}>Zmień hasło</Text>
            </Pressable>
            <Pressable onPress={WyslijPressed} style={styles.loginButton}>
              <Text style={styles.textButton}>Wyślij kod ponownie</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default ForgotPasswordChangeScreen;

const styles = StyleSheet.create({
  info: {
    alignItems: "center",
    paddingTop: "1rem",
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  root: {
    flexGrow: 1,
    width: "95%",
    height: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 35,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: "10%",
    borderRadius: 35,
    marginVertical: 5,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingLeft: 15,
    fontSize: 20,
  },
  text: {
    color: "red",
    fontSize: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: "30%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "rgba(255, 255, 255, 1)",
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
