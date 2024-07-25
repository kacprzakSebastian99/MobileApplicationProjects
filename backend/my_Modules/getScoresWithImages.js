const connection = require('./dbConnection');
const path = require('path');

const getScoresWithImages = (req, res) => {
    const { eventName } = req.params;
    const tableName = 'ranking' + eventName.replace(/\s/g, '');

    const sql = `SELECT userName, score, time, url FROM ${tableName}`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Błąd zapytania: ' + err.stack);
            return res.status(500).send('Błąd pobierania danych z db');
        }

        const dataWithFullUrls = results.map(result => ({
            ...result,
            url: result.url ? path.join('http://localhost:3000', result.url) : null,
        }));

        res.status(200).json(dataWithFullUrls);
    });
};

module.exports = getScoresWithImages;
