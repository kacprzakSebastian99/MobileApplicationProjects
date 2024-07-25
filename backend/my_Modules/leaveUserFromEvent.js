const connection = require('./dbConnection');

const leaveUserFromEvent = (req, res) => {
    const { eventName, userName } = req.params;

    if (!userName || !eventName) {
        return res.status(400).send('Nazwa użytkownika i identyfikator wydarzenia są wymagane');
    }

    const tableName = 'Ranking' + eventName;

    const sql = `DELETE FROM ${tableName} WHERE userName = ?`;

    const values = [userName];
    console.log(userName);
    console.log(tableName);

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Błąd zapytania: ' + err.stack);
            return res.status(500).send('Błąd wypisywania użytkownika z wydarzenia');
        }
        res.status(200).send('Użytkownik został pomyślnie wypisany z wydarzenia');
    });
};

module.exports = leaveUserFromEvent;
