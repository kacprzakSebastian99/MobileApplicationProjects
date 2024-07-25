const path = require('path');
const fs = require('fs');
const connection = require('./dbConnection');

const getScoreDetails = (req, res) => {
    const { eventName, userName } = req.query;
    const tableName = 'ranking' + eventName.replace(/\s/g, '');
    
    const sql = `
        SELECT userName, score, time, url FROM ${tableName} WHERE userName = ?`;

    connection.query(sql, [userName], (err, results) => {
        if (err) {
            console.error('Błąd zapytania: ' + err.stack);
            return res.status(500).send('Błąd pobierania wyników z bazy danych');
        }

        if (results.length === 0) {
            return res.status(404).send('Nie znaleziono wyników dla podanego użytkownika');
        }

        const result = results[0];

        const imagePath = path.join(__dirname, result.url); 
        const imageExists = fs.existsSync(imagePath); 

        const scoreDetails = {
            userName: result.userName,
            score: result.score,
            time: result.time,
            url: imageExists ? result.url : null 
        };
        res.status(200).json(scoreDetails);
    });
};

module.exports = getScoreDetails;
