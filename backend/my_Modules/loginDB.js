const connection = require("./dbConnection");

const loginDB = (username, password, typ, callback) => {
  const sql =
    "SELECT * FROM testdatabase.users WHERE (login = ? OR email = ?) AND haslo = ?";

  connection.query(sql, [username, username, password, typ], (err, results) => {
    if (err) {
      console.error("Błąd zapytania: " + err.stack);
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(new Error("Nieprawidłowy login lub hasło"), null);
    }

    callback(null, results);
  });
};

function loginDBHandler(req, res) {
  const { username, password, typ} = req.body;

  loginDB(username, password, typ, (err, results) => {
    if (err) {
      console.error("Błąd odczytu danych z bazy danych:", err);
      return res.status(500).send("Błąd odczytu danych z bazy danych");
    }
    res.json(results);
  });
}

module.exports = loginDBHandler;
