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
// app.get('',(req, res) =>{
//     res.render('index',{title: 'Home Page'})
// });

// app.get('/about',(req, res) =>{
//     res.render('about',{title: 'About Biscuits Industrial'})
// });
// app.get('/ships',(req, res) =>{
//     res.render('ships',{title: 'Building ships?'})
// });
//leave this at the bottom, it's your error code
app.use(function(req, res) {
    res.status(400);
   res.render('error/404.ejs', {title: '404: File Not Found'});
   });
app.listen(port, () => console.info(`listening on port ` + port))