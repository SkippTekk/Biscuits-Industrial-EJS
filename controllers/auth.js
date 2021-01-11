require('dotenv').config();

const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = mysql.createPool({
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DBU,
    host: process.env.MYSQL_HOST,
    charset: 'utf8mb4_bin'
  });

  exports.login = async (req, res) =>{
    var email = req.body.email;
    var password = req.body.password;
  
    var sql = 'select * from users where email = ?;';
  
    db.query(sql,[email], function(err,results,fields){
      if(err) throw err;
      if(results.length && bcrypt.compareSync(password, results[0].password)){
        req.session.email = email;
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
    var username = req.body.username;
    var evename = req.body.evename;
    var email = req.body.email;
    var password = req.body.password;
    var vpass = req.body.passwordVerify

        if(vpass === password){
            var sql = 'select * from users where email = ?;'
            db.query(sql, [email], function(err, result, fields){
              if(err) throw err;
              
              if(result.length > 0){
                  req.session.flag = 1;
                  console.log('email already exists ' + email)
                  res.redirect('register', { message: 'email already exists.'});            
        } else {
            var hashedPassword = bcrypt.hashSync(password, 8);
            var sql = 'insert into users(username, evename, email, password) values(?,?,?,?);';
            
            db.query(sql,[username,evename,email, hashedPassword], function(err, result, fields){
                if(err) throw err;
                req.session.flag = 2;
                console.log('register of ' + username, email)
                res.redirect('/');
            });
        };
      })
    } else{
      req.session.flag = 3
      res.render('register', {
        title: 'Registration'
      });

    }
};