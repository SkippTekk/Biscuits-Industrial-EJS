require('dotenv').config();

const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport')
const db = mysql.createPool({
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DBU,
    host: process.env.MYSQL_HOST,
    charset: 'utf8mb4_bin'
  });

  exports.login = async (req, res) =>{
    var username = req.body.username;
    var password = req.body.password;
  
    var sql = 'select * from users where username = ?;';
  
    db.query(sql,[username], function(err,results,fields){
      if(err) throw err;
      if(results.length && bcrypt.compareSync(password, results[0].password)){
        req.session.username = username;
        res.redirect('/dashboard');
      } else {
        req.session.flag = 4;
        res.render('login', {
          title: 'Login'
        });
      }
    });
  }

exports.register = (req, res) => {
  const email  = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const evename = req.body.evename;


  bcrypt.hash(password, 8,(err, hash) => {
    if(err){
      console.log(err)
    }
    db.query(
      'INSERT INTO users(username, email, evename, password) VALUES (?,?,?,?)',[username, email, evename, hash],
      (err, result) => {
        db.query('SELECT LAST_INSERT_ID() as user_id', function(err, results, fields) {
          if (err) throw error;
          const user_id = results[0];
          req.login(user_id, function(err){
            res.redirect('/login');
          })
        })
        console.log(err);
      }
    )
  })
};
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});
function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}