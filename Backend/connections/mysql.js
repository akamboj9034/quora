var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    port: '3306',
    host: 'quora.cwwpvsr8sdqc.us-west-1.rds.amazonaws.com',
    user: 'quora',
    password: 'cmpe273273',
    database: 'quora'
})


module.exports = pool;