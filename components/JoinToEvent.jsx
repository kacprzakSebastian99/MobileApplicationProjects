import { Alert } from "react-native";
import { userNameJoin } from "./LoginScreen";
import { eventNameJoin } from "./ShowEvents";
import { ipAddress } from "./ipAddress";

const JoinToEvent = async () => {
  try {
    const userName = userNameJoin;
    const eventName = eventNameJoin;

    const response = await fetch(`http://${ipAddress}:3000/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        eventName,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    Alert.alert("Sukces", "Zapisano się na wydarzenie");
  } catch (error) {
    console.error("Błąd podczas przesyłania danych: ", error);
    Alert.alert(
      "Błąd",
      `Wystąpił problem podczas zapisywania się na wydarzenie: ${error.message}`
    );
  }
};

export default JoinToEvent;
