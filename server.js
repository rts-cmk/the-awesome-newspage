// indlæs express modulet
const express = require('express');
// start applikationen 
const app = express();

// aktiver log af side indlæsninger
const logger = require('morgan');
app.use(logger('dev'));

// sæt viewengine til ejs 
app.set('view engine', 'ejs');
app.set('views', './server/views');


const port = 3000;
app.listen(port, function (error) {
   if (error) {
      console.log(error);
   }
   console.log('================================================================');
   console.log('Server is listening on port %s, address: %s', port, 'http://localhost:' + port);
});


// sæt serveren op så den kan servere html/css/javascript og billeder direkte fra public mappen
app.use(express.static('public'));







app.get('/frontpage', function (req, res) {
   res.send('Hello World');
});