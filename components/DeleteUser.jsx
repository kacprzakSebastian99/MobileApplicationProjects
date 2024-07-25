import { ipAddress } from "./ipAddress";
import { userId } from "./LoginScreen";

const DeleteUser = async () => {
  try {
    const response = await fetch(
      `http://${ipAddress}:3000/deleteUser/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Wystąpił błąd podczas usuwania użytkownika");
    }
    console.log("Użytkownik został pomyślnie usunięty z bazy danych");
    return true; 
  } catch (error) {
    console.error("Błąd podczas usuwania użytkownika: ", error);
    return false; 
  }
};

export default DeleteUser;
