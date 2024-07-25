const connection = require('./dbConnection');

const updateEventInDB = (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  const { name, description, startDate, startTime, maxLimit, terms, status } = req.body;

  if (!id || !name || !description || !startDate || !startTime || !maxLimit || !terms || !status) {
    return res.status(400).send('Wszystkie pola są wymagane');
  }

  const getRankingTableNameSQL = `SELECT name FROM testdatabase.Wydarzenia WHERE id = ?`;

  connection.query(getRankingTableNameSQL, [id], (err, results) => {
    if (err) {
      console.error("Błąd pobierania nazwy tabeli rankingu: " + err.stack);
      return res.status(500).send("Błąd pobierania danych z db");
    }

    const oldEventName = results[0].name;
    const oldRankingTableName = "ranking" + oldEventName;
    const newRankingTableName = "ranking" + name;

    const updateEvent = () => {
      const updateEventSQL = `
        UPDATE testdatabase.Wydarzenia 
        SET name = ?, description = ?, startDate = ?, startTime = ?, maxLimit = ?, terms = ?, status = ?
        WHERE id = ?`;

      const values = [name, description, startDate, startTime, maxLimit, terms, status, id];

      connection.query(updateEventSQL, values, (err, results) => {
        if (err) {
          console.error('Błąd zapytania: ' + err.stack);
          return res.status(500).send('Błąd aktualizacji danych w db');
        }
        res.status(200).send('Wydarzenie zostało pomyślnie zaktualizowane w bazie danych');
      });
    };

    if (oldEventName !== name) {
      const renameRankingTableSQL = `RENAME TABLE testdatabase.${oldRankingTableName} TO testdatabase.${newRankingTableName}`;

      connection.query(renameRankingTableSQL, (err, results) => {
        if (err) {
          console.error("Błąd zmiany nazwy tabeli rankingu: " + err.stack);
          return res.status(500).send("Błąd zmiany nazwy tabeli rankingu w db");
        }
        updateEvent();
      });
    } else {
      updateEvent();
    }
  });
};

module.exports = updateEventInDB;
