const connection = require("./dbConnection");

const deleteEventFromDB = (req, res) => {
  const eventId = req.params.eventId;

  if (!eventId) {
    return res.status(400).send("Brak identyfikatora wydarzenia");
  }

  const getRankingTableNameSQL =
    `SELECT name FROM testdatabase.Wydarzenia WHERE id = ?`;

  connection.query(getRankingTableNameSQL, eventId, (err, results) => {
    if (err) {
      console.error("Błąd pobierania nazwy tabeli rankingu: " + err.stack);
      return res.status(500).send("Błąd pobierania danych z db");
    }

    const rankingTableName = "ranking" + results[0].name;

    const deleteEventSQL = `DELETE FROM testdatabase.Wydarzenia WHERE id = ?`;
    const dropRankingTableSQL = `DROP TABLE IF EXISTS testdatabase.${rankingTableName}`;

    connection.query(deleteEventSQL, eventId, (err, results) => {
      if (err) {
        console.error("Błąd zapytania usuwania wydarzenia: " + err.stack);
        return res.status(500).send("Błąd usuwania wydarzenia z db");
      }

      connection.query(dropRankingTableSQL, (err, results) => {
        if (err) {
          console.error(
            "Błąd zapytania usuwania tabeli rankingu: " + err.stack
          );
          return res.status(500).send("Błąd usuwania tabeli rankingu z db");
        }

        res
          .status(200)
          .send("Wydarzenie zostało pomyślnie usunięte z bazy danych");
      });
    });
  });
};

module.exports = deleteEventFromDB;
