const connection = require("./dbConnection");

const getUsersEvent = (req, res) => {
  const { eventName } = req.params;

  if (!eventName) {
    return res.status(400).send("Nazwa wydarzenia jest wymagana");
  }

  const tableName = "ranking" + eventName;
  console.log(tableName);
  const sql = `SELECT userName FROM ${tableName}`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Błąd zapytania: " + err.stack);
      return res.status(500).send("Błąd pobierania użytkowników z wydarzenia");
    }
    res.status(200).json(results);
  });
};

module.exports = getUsersEvent;
