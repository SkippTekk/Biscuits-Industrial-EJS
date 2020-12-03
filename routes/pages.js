const express = require('express');
const app = express.Router();
//const bcrypt = require('bcrypt');


//showing files to the public
app.get('/',(req, res) =>{
    res.render('index',{title: 'Home Page'})
});

app.get('/about',(req, res) =>{
    res.render('about',{title: 'About Biscuits Industrial'})
});
app.get('/ships',(req, res) =>{
    res.render('ships',{title: 'Building ships?'})
});
app.use('/auth', require('../routes/auth'));

app.get('/login', (req, res) => {
  res.render('login');
});



app.get('/register', (req, res) => {
  res.render('register');
});



app.get('/ships', function (req, res) {
  res.render('ships')
});

  //api shit 
const apiRouter = require('../server/routes')
app.use('/api/InvTypes', apiRouter)
app.use(function(req, res) {
    res.render('../api');
});
module.exports = app;