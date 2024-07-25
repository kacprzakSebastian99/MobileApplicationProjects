import * as React from "react";
import { Image, TouchableOpacity } from "react-native";

export function LogoTitle({ navigation, isLoggedIn, userType }) {
  const handleLogoPress = () => {
      navigation.navigate("Home");
  };
  return (
    <TouchableOpacity onPress={handleLogoPress}>
      <Image
        style={{ width: 50, height: 50 }}
        source={require("../Images/LogoZUT.png")}
      />
    </TouchableOpacity>
  );
}

export function MenuIcon() {
  return (
    <TouchableOpacity onPress={() => alert("This is a button!")}>
      <Image
        source={require("../Images/ManIcon.png")}
        style={{ width: 30, height: 30, marginRight: 10 }}
      />
    </TouchableOpacity>
  );
}
