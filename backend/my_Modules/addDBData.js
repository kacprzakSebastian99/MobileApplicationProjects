const connection = require('./dbConnection');

const addDataToDatabase = (req, res) => {
    const { id, firstName, lastName } = req.body;

    if (!id || !firstName || !lastName) {
        return res.status(400).send('Wszystkie pola są wymagane');
    }

    const sql = 'INSERT INTO testdatabase.testtable (id, firstname, lastname) VALUES (?, ?, ?)';
    const values = [id, firstName, lastName];
    console.log(values);

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Błąd zapytania: ' + err.stack);
            return res.status(500).send('Błąd dodawania danych do bazy danych');
        }
        res.status(200).send('Dane zostały pomyślnie dodane do bazy danych');
    });
};

module.exports = addDataToDatabase;


