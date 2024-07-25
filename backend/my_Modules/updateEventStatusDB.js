const connection = require("./dbConnection");

const updateEventStatusDB = (req, res) => {
  const eventId = req.params.id;
  const { status } = req.body;

  const query = "UPDATE testdatabase.Wydarzenia SET status = ? WHERE id = ?";
  connection.query(query, [status, eventId], (error, results) => {
    if (error) {
      console.error("Błąd podczas aktualizacji statusu wydarzenia:", error);
      res
        .status(500)
        .json({ error: "Błąd podczas aktualizacji statusu wydarzenia" });
    } else {
      res
        .status(200)
        .json({ message: "Status wydarzenia został pomyślnie zaktualizowany" });
    }
  });
};

module.exports = updateEventStatusDB;
