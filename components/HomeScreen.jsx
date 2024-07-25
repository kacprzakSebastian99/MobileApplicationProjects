import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import BackgroundTriangles from "./BackgrountZUT";
import { useLayoutEffect } from "react";
import Icon from "react-native-vector-icons/Entypo";
import { DrawerActions } from "@react-navigation/native";
import ShowEvents from './ShowEvents';

export let isLog;

function HomeScreen({ navigation, setIsLoggedIn, isLoggedIn }) {
  logged = isLoggedIn;
  isLog = isLoggedIn;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return isLoggedIn ? (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Icon name="menu" size={30} color="#900" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")} >
            <Text>ZALOGUJ</Text>
          </TouchableOpacity>
        );
      },
      headerLeft: () => null,
    });
  }, [navigation, setIsLoggedIn, isLoggedIn]);

  return (
    <View style={styles.container}>
      <BackgroundTriangles />
      <View>
        <ShowEvents />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
