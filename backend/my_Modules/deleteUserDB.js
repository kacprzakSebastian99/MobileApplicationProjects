const connection = require("./dbConnection");

const deleteUserDB = (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send("blad");
  }
  const deleteUserSql = "DELETE FROM testdatabase.users WHERE id = ?";
  const dropNotificationTableSQL = `DROP TABLE IF EXISTS testdatabase.notifications_${userId}`;
  connection.query(deleteUserSql, [userId], (err, results) => {
    if (err) {
      console.error("blad usuniecia uzytkownika: " + err.stack);
      return res.status(500).send("Błąd pobierania danych z db");
    }
    connection.query(dropNotificationTableSQL, (err, results) => {
      if (err) {
        console.error(
          "blad usuniecia tablicy powiadomien uzytkownika " + err.stack
        );
        return res
          .status(500)
          .send("blad usuniecia tablicy powiadomien uzytkownika z db");
      }
      console.log("usunieto usera");
      res
        .status(200)
        .send("uzytkownik został pomyślnie usunięty z bazy danych");
    });
  });
};

module.exports = deleteUserDB;
