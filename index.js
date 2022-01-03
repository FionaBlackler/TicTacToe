const express = require('express');
const path = require("path");

// App initialisierung
const port = process.env.PORT || 3000;
const app = express();

// App Konfiguration
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');

// App request
// GET Requests vgl. PHP $_GET, aber auch eben auch im Browser localhost:3000
app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/about', function(req, res) {
  res.render('pages/about');
});

// App start
// POST Requests vgl. PHP $_POST
app.listen(port, () => {
 console.log('Server ist running on port: '+ port);
});