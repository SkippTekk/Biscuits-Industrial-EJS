const express = require('express');
const expressValid = require('express-validator')
const app = express.Router();
const authController = require('../controllers/auth');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser= require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const connect = mysql.createConnection({
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    charset: 'utf8mb4_bin'
});
var options = {
  password: process.env.MYSQL_PASS,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DBU,
  host: process.env.MYSQL_HOST,
  charset: 'utf8mb4_bin'
};
var sessionStore = new MySQLStore(options);

//passport
const passport = require('passport')
app.use(passport.initialize());
app.use(passport.session());

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


app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({
  secret: process.env.loginsecret,
  resave: false,
  store: sessionStore,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 60 * 60 * 24
  }
}));
//website loading shit

app.get('/',(req, res) =>{
  console.log(req.cookie)
  console.log(req.session)
  res.render('index',{
    title: 'Home Page',
  });
});

app.get('/about',(req, res) =>{
    res.render('about',{
      title: 'About Biscuits Industrial',
      uptime: ut_hour+ " hours " + ut_min +" minutes " + ut_sec + " seconds",
      load: os.loadavg(),
      type: os.platform(),
      memoryTotal: Math.floor(memoryFree),
      memoryLeft: Math.floor(memorytotal),
      
    });
});
//login crap
app.get('/login', (req, res) => {
  if(req.session.user){
    res.send('/dashboard')
  }else {
  res.render('login', {
    title: 'Login',
    user: req.user
  });
}
});
// app.post('/login', authController.login);
app.post('/login', (req, res) => {
  console.log(req.user)
  console.log(req.isAuthenticated)
  
});


//register crap
app.get('/register', function(req, res,next) {

  res.render('register');
});
app.post('/register', authController.register);

//account seeing
app.get('/dashboard', authenticationMiddleware, function(req, res, next) {
  if(req.session.id){
    res.render('dashboard', {
      message: req.session.email
    })
    console.log('/dashboard error log  ' + req.session.id);
    
  }else {
    res.redirect('login');
}
  
});

//logout of the website
app.get('/logout',
  function(req, res){
    req.session.destroy();
    res.redirect('/');
  });

//fucking around with settings shit breaks here
app.get('/biscuits', function (req, res) {
  const sqlite3 = require('sqlite3').verbose();

  let db = new sqlite3.Database(":memory:");
  db.each("SELECT * from users", function(err, row) {
    console.log(err);});
    db.close();
});


app.get('/ships', function (req, res) {
  res.render('ships')
});
app.get('/ships/:item', (req, res) => {
    connect.query('SELECT * FROM invTypes WHERE typeName = ?', [req.params.item], function(err, results1){
      if(results1 < 1) {
        
        res.render('error/404', {
        })
      } else {
              connect.query('SELECT m.materialTypeID, m.quantity, i2.typeName, m.activityID FROM industryActivityMaterials m INNER JOIN invTypes i1 ON i1.typeID = m.typeID INNER JOIN invTypes i2 ON i2.typeID = m.materialtypeID INNER JOIN ramActivities i3 ON i3.activityID = m.activityID = 1 WHERE i1.typeName = ? AND m.activityID = 1 ORDER BY `m`.`materialTypeID` ASC', [req.params.item + ' blueprint'], function(err, results2){
                connect.query('SELECT m.materialTypeID, m.quantity, i2.typeName, m.activityID FROM industryActivityMaterials m INNER JOIN invTypes i1 ON i1.typeID = m.typeID INNER JOIN invTypes i2 ON i2.typeID = m.materialtypeID INNER JOIN ramActivities i3 ON i3.activityID = m.activityID = 1 WHERE i1.typeName = ? AND m.activityID = 1 ORDER BY `m`.`materialTypeID` ASC', [results2 + 'blueprint'], function(err, results3){
                  console.log(results3)
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
                  
                  MINERALS: results2,
                  MINERALS1: results3
            });
          });
      })}
      });
  });
  app.get('/modules', function (req, res) {
    res.render('ships')
  });
  app.get('/modules/:item', (req, res) => {
    connect.query('SELECT * FROM invTypes WHERE typeName = ?', [req.params.item], function(err, results1){
      if(results1 < 1) {
        
        res.render('error/404', {
        })
      } else {
              connect.query('SELECT m.materialTypeID, m.quantity, i2.typeName, m.activityID FROM industryActivityMaterials m INNER JOIN invTypes i1 ON i1.typeID = m.typeID INNER JOIN invTypes i2 ON i2.typeID = m.materialtypeID INNER JOIN ramActivities i3 ON i3.activityID = m.activityID = 1 WHERE i1.typeName = ? AND m.activityID = 1 ORDER BY `m`.`materialTypeID` ASC', [req.params.item + ' blueprint'], function(err, results2){
              res.render('moduleinformation', {
                  title: 'Building modules?',
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
                  
                  MINERALS: results2
            });
          });
      }
      });
  });


  
  
  //esiil
  const ESIIL = require('esiil')
  const project = ESIIL({
    clientID: process.env.SSOClient,
    clientSecret: process.env.SSOSecret,
    callbackURL: process.env.SSOcallback,
    userAgent: 'Biscuits Industrial IGN I Like Biscuits',
    state: 'MyState',
    scopes: ['publicData',
     'esi-location.read_location.v1',
      'esi-location.read_ship_type.v1',
       'esi-mail.read_mail.v1',
        'esi-skills.read_skills.v1',
         'esi-skills.read_skillqueue.v1',
          'esi-wallet.read_character_wallet.v1',
           'esi-clones.read_clones.v1',
            'esi-killmails.read_killmails.v1',
             'esi-assets.read_assets.v1',
              'esi-characters.read_medals.v1',
               'esi-characters.read_standings.v1',
                'esi-industry.read_character_jobs.v1',
                 'esi-characters.read_blueprints.v1',
                  'esi-location.read_online.v1',
                   'esi-clones.read_implants.v1',
                    'esi-characters.read_fatigue.v1',
                     'esi-industry.read_corporation_jobs.v1',
                      'esi-industry.read_character_mining.v1',
                       'esi-characters.read_titles.v1']
  });
  
  const myCharacter = project.newCharacter()
  const myUniverse = project.newUniverse()
  
  app.get('/eveauth', (req, res) => {
    res.status(301).redirect(project.authRequestURL())
  });
  
app.get('/callback', async (req, res) => {
    const { toonID } = await project.receiveAuthCode(req.query.code)
      res.redirect(`/myassets/${toonID}`)
      console.log(req.query.code)
  });
app.get('/mylp', async (req, res) => {
    myCharacter.lp(toonID)
    .then(res => console.dir(res.body))
    .catch(err => console.error(err))
    res.send('done')
  });
app.get('/myassets/:toonID', async (req, res) => {
    myCharacter.assets(req.params.toonID, { page: 1 })
    .then(res => console.dir(res.body))
    .catch(err => console.error(err))
    res.send('done')
  });
  
app.get('/getid', async (req, res) => {
      myUniverse.name2ID([`Tcgre'l en Karnt`])
          .then(res => console.dir(res.body))
          .catch(err => console.error(err))
      res.send('done')
  });
  //api shit
const apiRouter = require('../server/routes');
const { ESRCH } = require('constants');

app.get('/api', function (req, res) {
    res.render('../api')
  });
app.use('/api/InvTypes', apiRouter)  
  module.exports = app;
  function authenticationMiddleware () {  
    return (req, res, next) => {
      console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
  
        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
  }