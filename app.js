require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.port;
const db = require('./server/index');




app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', require('./routes/pages'));

//error handling like 404, but sadly it's fucking BROKEN as usual


// app.use(function(req, res) {
//   res.status(400);
//  res.render('error/404.ejs', {title: '404: File Not Found'});
//  });
app.use(function(req,res){
    res.status(404)
    res.render('error/404')
});


//os info


app.listen(port, () => console.info(`listening on port ` + port))