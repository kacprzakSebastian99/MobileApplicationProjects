const connection = require("./dbConnection");

const addEventToDB = (req, res) => {
  const { name, description, startDate, startTime, maxLimit, terms, status } =
    req.body;

  if (
    !name ||
    !description ||
    !startDate ||
    !startTime ||
    !maxLimit ||
    !terms ||
    !status
  ) {
    return res.status(400).send("Wszystkie pola są wymagane");
  }

  const createEventsTableSQL = `create table if not exists testdatabase.Wydarzenia(id INT auto_increment PRIMARY KEY, name varchar(255), description varchar(2000), startDate varchar(30), startTime varchar(30), maxLimit int, terms varchar(255), status varchar(255) );`;

  const sql =
    "INSERT INTO testdatabase.Wydarzenia (name, description, startDate, startTime, maxLimit, terms, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    name,
    description,
    startDate,
    startTime,
    maxLimit,
    terms,
    status,
  ];
  console.log(values);

  connection.query(createEventsTableSQL, (err) => {
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error("Błąd zapytania: " + err.stack);
        return res.status(500).send("Błąd dodawania danych do db");
      }

      const tableName = "Ranking" + name.replace(/\s/g, ""); 
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            userName VARCHAR(255) PRIMARY KEY,
            position INT,
            score DOUBLE,
            time TIME,
            url VARCHAR(255),
            screen LONGBLOB
        )
    `;

      connection.query(createTableSQL, (err, results) => {
        if (err) {
          console.error("Błąd tworzenia tabeli: " + err.stack);
          return res.status(500).send("Błąd tworzenia tabeli w bazie danych");
        }
        res.status(200).send("Dane zostały pomyślnie dodane do bazy danych");
      });
    });
  });
};

module.exports = addEventToDB;
