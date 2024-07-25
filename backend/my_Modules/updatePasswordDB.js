const connection = require("./dbConnection");

const updatePasswordDB = (req, res) => {
  const { code, newPassword } = req.body;

  checkCodeSql = "SELECT email FROM testdatabase.users WHERE tokens = ?";

  connection.query(checkCodeSql, [code], (error, results) => {
    if (error) {
      return res.status(500).send({ message: "Database error", error });
    }
    if (results.length === 0) {
      return res.status(400).send({ message: "Invalid code" });
    }

    const email = results[0].email;
    const updatePasswordSql = "UPDATE users SET haslo = ? WHERE email = ?";

    connection.query(
      updatePasswordSql,
      [newPassword, email],
      (err, updateResults) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Failed to update password", err });
        }
        res.status(200).send({ message: "Password updated successfully" });
      }
    );
  });
};

module.exports = updatePasswordDB;
