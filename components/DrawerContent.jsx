import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DeleteUser from "./DeleteUser";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const DrawerList = [
  { icon: "account-multiple", label: "Login", navigateTo: "Login" },
];

const DrawerLayout = ({ icon, label, navigateTo }) => {
  const navigation = useNavigation();
  return (
    <DrawerItem
      icon={({ color, size }) => <Icon name={icon} color={color} size={size} />}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo);
      }}
    />
  );
};

const DrawerItems = (props) => {
  return DrawerList.map((el, i) => {
    return (
      <DrawerLayout
        key={i}
        icon={el.icon}
        label={el.label}
        navigateTo={el.navigateTo}
      />
    );
  });
};

const DrawerContent = ({ isLoggedIn, setIsLoggedIn, userType, ...props }) => {
  const [userDeleted, setUserDeleted] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const handleSignOut = async () => {
      await AsyncStorage.removeItem("userId");
      navigation.navigate("Home");
    };

    return () => {
      handleSignOut();
    };
  }, []);

  const handleUserDelete = async () => {
    const isDeleted = await DeleteUser();
    if (isDeleted) {
      setUserDeleted(true);
      await AsyncStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigation.navigate("Home");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Potwierdzenie usunięcia",
      "Czy na pewno chcesz usunąć swoje konto?",
      [
        {
          text: "Anuluj",
          onPress: () => console.log("Anulowano usuwanie konta"),
          style: "cancel",
        },
        { text: "Usuń", onPress: handleUserDelete },
      ],
      { cancelable: false }
    );
  };

  const handleHomeNavigation = () => {
      navigation.navigate("Home");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Wydarzenia"
              onPress={handleHomeNavigation}
            />
            <DrawerItems />
            {isLoggedIn && (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="account-cancel" color={color} size={size} />
                )}
                label="Usuń konto"
                onPress={confirmDelete}
              />
            )}
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Wyloguj"
          onPress={() => {
            setIsLoggedIn(false);
            navigation.navigate("Home");
          }}
        />
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 13,
    lineHeight: 14,
    // color: '#6e6e6e',
    width: "100%",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
    borderBottomWidth: 0,
    borderBottomColor: "#dedede",
    borderBottomWidth: 1,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#dedede",
    borderTopWidth: 1,
    borderBottomColor: "#dedede",
    borderBottomWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
