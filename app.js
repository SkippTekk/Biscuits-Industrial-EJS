require('dotenv').config()
const express = require('express');
const MySQLStore = require('express-mysql-session')
const app = express();
const port = process.env.port;
const db = require('./server/index');
const mysql = require('mysql');
// require('./server/mail');

//user database connection
const sql = mysql.createConnection({
  password: process.env.MYSQL_PASS,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DBU,
  host: process.env.MYSQL_HOST,
  charset: 'utf8mb4_bin'
})


app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));

app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(function(req, res, next) { 
  console.log("URI Request: " + req.url); 
  return next(); 
});
app.use('/', require('./routes/pages'));

//error handling like 404, but sadly it's fucking BROKEN as usual

app.use(function(req, res) {
  res.status(400);
 res.render('error/404', {title: '404: File Not Found'});
 });

app.listen(port, () => console.info(`listening on port ` + port))