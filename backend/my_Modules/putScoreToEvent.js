const path = require('path');
const connection = require('./dbConnection');

const sendScores = (req, res) => {
    const { eventName, userName, score, time } = req.body;
    const image = req.file;

    if (!eventName || !userName || !score || !time || !image) {
        return res.status(400).send('Wszystkie pola są wymagane');
    }

    const tableName = 'ranking' + eventName.replace(/\s/g, ''); 
    const imageUrl = path.join('../ScoreImages', image.filename);

    const sql = `
        UPDATE ${tableName}
        SET score = ?, time = ?, url = ?
        WHERE userName = ?`;

    const values = [score, time, imageUrl, userName];

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Błąd zapytania: ' + err.stack);
            return res.status(500).send('Błąd aktualizacji danych w db');
        }
        res.status(200).send('Wyniki zostały pomyślnie zaktualizowane');
    });
};

module.exports = sendScores;
