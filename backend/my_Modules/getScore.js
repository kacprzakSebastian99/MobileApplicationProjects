const connection = require("./dbConnection");

const getScores = (req, res) => {
  const { eventName } = req.params;


  const tableName = "ranking" + eventName.replace(/\s/g, ""); 

  const sql = `
        SELECT userName, score, time,
         COALESCE((SELECT ROUND(AVG(score), 2) FROM ${tableName}), 0) AS averageScore,
        COALESCE((SELECT ROUND(SUM(score), 2) FROM ${tableName}), 0) AS totalScore
        FROM ${tableName}
        ORDER BY score DESC`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Błąd zapytania: " + err.stack);
      return res.status(500).send("Błąd pobierania danych z db");
    }
    res.status(200).json(results);
  });
};

module.exports = getScores;
