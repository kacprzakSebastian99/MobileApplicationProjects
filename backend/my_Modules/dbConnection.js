const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306, //przyklad
    user: 'root', //przyklad
    password: 'admin', //przyklad
    database: 'testdatabase' //przyklad
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Połączono z bazą danych');
});

module.exports = connection;
