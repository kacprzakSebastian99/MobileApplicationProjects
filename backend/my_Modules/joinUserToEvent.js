const connection = require("./dbConnection");

const joinUserToEvent = (req, res) => {
  const { userName, eventName } = req.body;

  if (!userName || !eventName) {
    return res.status(400).send("Nazwa użytkownika i wydarzenia są wymagane");
  }

  const eventQuery = `SELECT maxLimit FROM testdatabase.Wydarzenia WHERE name = ?`;
  connection.query(eventQuery, [eventName], (error, eventResult) => {
    if (error) {
      console.error("Błąd podczas sprawdzania limitu wydarzenia: ", error);
      return res
        .status(500)
        .send("Wystąpił błąd podczas sprawdzania limitu wydarzenia");
    }

    if (eventResult.length === 0) {
      return res.status(404).send("Wydarzenie nie znalezione");
    }

    const maxLimit = eventResult[0].maxLimit;

    const userCountQuery = `SELECT COUNT(*) AS userCount FROM ranking${eventName}`;
    connection.query(userCountQuery, (error, countResult) => {
      if (error) {
        console.error("Błąd podczas liczenia użytkowników: ", error);
        return res
          .status(500)
          .send("Wystąpił błąd podczas liczenia użytkowników");
      }

      const userCount = countResult[0].userCount;

      if (userCount >= maxLimit) {
        return res
          .status(400)
          .send("Limit uczestników wydarzenia został osiągnięty");
      }

      const joinQuery = `INSERT INTO ranking${eventName} (userName) VALUES (?)`;
      connection.query(joinQuery, [userName], (error) => {
        if (error) {
          console.error("Błąd podczas zapisywania się na wydarzenie: ", error);
          return res
            .status(500)
            .send("Wystąpił błąd podczas zapisywania się na wydarzenie");
        }

        res.status(200).send("Zapisano na wydarzenie");
      });
    });
  });
};

module.exports = joinUserToEvent;
