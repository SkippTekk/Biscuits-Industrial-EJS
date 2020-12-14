const express = require('express');
const app = express.Router();
//const bcrypt = require('bcrypt');
const mysql = require('mysql')
const connect = mysql.createConnection({
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    charset: 'utf8mb4_bin'
})

// OS information
const os = require('os');
const { callbackify } = require('util');

var ut_sec = os.uptime(); 
var ut_min = ut_sec/60; 
var ut_hour = ut_min/60;
ut_sec = Math.floor(ut_sec); 
ut_min = Math.floor(ut_min); 
ut_hour = Math.floor(ut_hour); 
  
ut_hour = ut_hour%60; 
ut_min = ut_min%60; 
ut_sec = ut_sec%60; 
memoryLeft = os.totalmem();
memoryFree = memoryLeft*0.000001;
memoryTotal = os.freemem();
memorytotal = memoryTotal*0.000001;
//showing files to the public
app.get('/',(req, res) =>{
    res.render('index',{title: 'Home Page'})
});

app.get('/about',(req, res) =>{
    res.render('about',{
      title: 'About Biscuits Industrial',
      uptime: ut_hour+ " hours " + ut_min +" minutes " + ut_sec + " seconds",
      load: os.loadavg(),
      type: os.platform(),
      memoryTotal: Math.floor(memoryFree),
      memoryLeft: Math.floor(memorytotal)
    })
});
app.get('/ships/:id', (req, res) => {

  connect.query('SELECT * FROM invTypes WHERE typeName = ?', [req.params.id], function(err, results1){
    connect.query('SELECT m.materialTypeID, m.quantity, i2.typeName, m.activityID FROM industryActivityMaterials m INNER JOIN invTypes i1 ON i1.typeID = m.typeID INNER JOIN invTypes i2 ON i2.typeID = m.materialtypeID INNER JOIN ramActivities i3 ON i3.activityID = m.activityID = 1 WHERE i1.typeName = ? AND m.activityID = 1 ORDER BY `m`.`materialTypeID` ASC', [req.params.id + ' blueprint'], function(err, results2){            
            res.render('shipinformation', {
                title: 'Building ships?',
                typeid: results1[0].typeID,
                groupid: results1[0].groupID,
                typename: results1[0].typeName,
                description: results1[0].description,
                mass: results1[0].mass,
                volume: results1[0].volume,
                capacity: results1[0].capacity,
                portionSize: results1[0].portionSize,
                raceID: results1[0].raceID,
                graphicID: results1[0].graphicID,
                Arkonor: results1[0].Arkonor,
                
                MINERALS: results2
            });
        })  
    })
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