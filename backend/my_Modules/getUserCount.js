const connection = require("./dbConnection");

const getUserCount = (req, res) => {
  const { eventName } = req.params;

  if (!eventName) {
    return res.status(400).send("Nazwa wydarzenia jest wymagana");
  }

  const tableName = "ranking" + eventName;
  const sql = `SELECT COUNT(*) AS userCount FROM ${tableName}`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Błąd zapytania: " + err.stack);
      return res
        .status(500)
        .send("Błąd pobierania liczby użytkowników z wydarzenia");
    }
    res.status(200).json(results[0]);
  });
};

module.exports = getUserCount;
