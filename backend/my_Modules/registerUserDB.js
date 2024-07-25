const connection = require("./dbConnection");

const registerUserDB = (req, res) => {
  const { username, email, password, passwordRepeat } = req.body;

  if (!username || !email || !password || !passwordRepeat) {
    return res.status(400).send("Wszystkie pola są wymagane");
  }
  if (password != passwordRepeat) {
    return res.status(400).send("Hasła sie róznią!");
  }

  const createTableSql = `create table if not exists testdatabase.users( id INT auto_increment PRIMARY KEY, login varchar(255), email varchar(255), haslo varchar(255), typ varchar(255) DEFAULT 'user', tokens varchar(10) );`;

  const sql =
    "INSERT INTO testdatabase.users (login,email,haslo) VALUES (?, ?, ?)";
  const values = [username, email, password];
  console.log(values);

  connection.query(createTableSql, (err) => {
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error("Błąd zapytania: " + err.stack);
        return res.status(500).send("Błąd dodawania danych do db");
      }

      const userId = results.insertId; // Get the ID of the newly inserted user
      const createNotificationsTableSql = `
      CREATE TABLE IF NOT EXISTS testdatabase.notifications_${userId} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_name VARCHAR(255) NOT NULL,
        notification_text VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

      connection.query(createNotificationsTableSql, (err) => {
        if (err) {
          console.error("Błąd zapytania: " + err.stack);
          return res.status(500).send("Błąd tworzenia tabeli powiadomień");
        }
        res
          .status(200)
          .send(
            "Dane zostały pomyślnie dodane do bazy danych i utworzono tabelę powiadomień"
          );
      });
    });
  });
};

module.exports = registerUserDB;
