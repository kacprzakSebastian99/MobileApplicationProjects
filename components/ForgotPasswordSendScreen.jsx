import React from "react";
import { View, ScrollView, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BackgroundTriangles from "./BackgrountZUT";
import { ipAddress } from "./ipAddress";

const ForgotPasswordSendScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const WyslijPressed = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:3000/sendCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.warn("Code sent successfully", data);
      navigation.navigate("ForgotChange");
    } catch (error) {
      console.error("Error sending code", error);
    }
  };

  return (
    <View>
      <BackgroundTriangles />
      <View>
        <View style={styles.info}>
          <Text style={styles.text}>
            Wprowadź email na który ma zostać wysłany kod potrzebny do
            zresetowania hasła.
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.root}>
            <Text style={styles.title}>Zmiana hasla</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <Pressable onPress={WyslijPressed} style={styles.loginButton}>
              <Text style={styles.textButton}>Wyslij kod</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default ForgotPasswordSendScreen;

const styles = StyleSheet.create({
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
  title: {
    color: "#0C7E43",
    fontSize: 32,
    fontWeight: "bold",
  },
  input: {
    height: "20%",
    borderRadius: 35,
    marginVertical: 5,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingLeft: 15,
    fontSize: 18,
  },
  text: {
    color: "red",
    fontSize: 20,
    paddingHorizontal: 5,
  },
  info: {
    alignItems: "center",
    paddingTop: "1rem",
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: "10%",
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
