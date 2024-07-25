const connection = require("./dbConnection");
const nodemailer = require("nodemailer");

const generateRandomCode = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const sendCodeDB = async (req, res) => {
  const { email } = req.body;
  const code = generateRandomCode(6);

  const transporter = nodemailer.createTransport({
    service: "Hotmail", //przyklad
    auth: {
      user: "zutappka123@outlook.com", //przyklad
      pass: "Mejlik123@", //przyklad
    },
  });

  const mailOptions = {
    from: "zutappka123@outlook.com", //przyklad
    to: email,
    subject: "Kod do zresetowania hasła",
    text: `Twój kod do zresetowania hasła to: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);

    sql = "UPDATE testdatabase.users SET tokens = ? WHERE email = ?";

    connection.query(sql, [code, email], (error, results) => {
      if (error) {
        return res.status(500).send({ message: "Database error", error });
      }
      res.status(200).send({ message: "Code sent successfully" });
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to send code", error });
  }
};

module.exports = sendCodeDB;




