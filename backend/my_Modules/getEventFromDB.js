const connection = require('./dbConnection');

const getEventDataFromDatabase = (callback) => {
    const sql = 'SELECT * FROM testdatabase.Wydarzenia';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Błąd zapytania: ' + err.stack);
            return callback(err, null);
        }
        callback(null, results);
    });
};

function getEventDataFromDatabaseHandler(req, res) {
    getEventDataFromDatabase((err, results) => {
        if (err) {
            return res.status(500).send('Błąd odczytu danych z bazy danych');
        }
        res.json(results);
    });
}

module.exports = getEventDataFromDatabaseHandler;
