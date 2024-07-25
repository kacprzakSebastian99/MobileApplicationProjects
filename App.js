import * as React from "react";
import { TouchableOpacity, Text } from "react-native";
import { DrawerActions, NavigationContainer, DefaultTheme, } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import AddEvent from "./components/AddEvent";
import ShowEvents from "./components/ShowEvents";
import EditEvent from "./components/EditEvent";
import PreviewEvent from "./components/PreviewEvent";
import { LogoTitle } from "./components/HeaderBar";
import HomeScreen from "./components/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SendScores from "./components/sendScore";
import Scoreboard from "./components/Ranking";
import ScoreDetails from "./components/ScorePreview";
import DisplayScores from "./components/DisplayScores";
import LoginScreen from "./components/LoginScreen";
import RegistrationScreen from "./components/RegistrationScreen";
import ForgotPasswordChangeScreen from "./components/ForgotPasswordChangeScreen";
import ForgotPasswordSendScreen from "./components/ForgotPasswordSendScreen";
import DrawerContent from "./components/DrawerContent";
import Icon from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};

const HomeStack = ({ navigation, isLoggedIn, setIsLoggedIn, userType }) => {
  return (
      <Stack.Navigator
        themes={MyTheme}
        screenOptions={{
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
          headerTitle: (props) => (
            <LogoTitle
              {...props}
              navigation={navigation}
              isLoggedIn={isLoggedIn}
              userType={userType}
            />
          ),
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              setIsLoggedIn={setIsLoggedIn}
              isLoggedIn={isLoggedIn}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="EventData" component={ShowEvents} />
        <Stack.Screen name="Ranking" component={Scoreboard} />
        <Stack.Screen name="ScoreDetails" component={ScoreDetails} />
        <Stack.Screen name="DisplayScores" component={DisplayScores} />
        <Stack.Screen name="Add" component={AddEvent} />
        <Stack.Screen name="EditEvent" component={EditEvent} />
        <Stack.Screen name="PreviewEvent" component={PreviewEvent} />
        <Stack.Screen name="ShowEvents" component={ShowEvents} />
        <Stack.Screen name="SendScore" component={SendScores} />
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="ForgotSend" component={ForgotPasswordSendScreen} />
        <Stack.Screen name="ForgotChange" component={ForgotPasswordChangeScreen} />
      </Stack.Navigator>
  );
};

const DrawerRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  const Drawer = createDrawerNavigator();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem("userType");
      setUserType(type);
    };
    fetchUserType();
  }, [isLoggedIn]);
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContent
          {...props}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userType={userType}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerStyle: {
          opacity: 0.8,
        },
      }}
    >
      <Drawer.Screen name="HomeStack">
        {(props) => (
          <HomeStack
            {...props}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            userType={userType}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <DrawerRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </NavigationContainer>
  );
}

export default App;
