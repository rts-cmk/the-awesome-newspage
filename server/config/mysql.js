const mysql = require('mysql2'); // mysql

module.exports = {
   connect: function () {
      return mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: 'root',
         port: '3306',
         database: 'the_awesome_newpage'
      })
   }
}