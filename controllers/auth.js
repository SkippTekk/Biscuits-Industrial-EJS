require('dotenv').config();

const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = mysql.createPool({
    password: process.env.MYSQL_PASSU,
    user: process.env.MYSQL_USERU,
    database: process.env.MYSQL_DBU,
    host: process.env.MYSQL_HOST,
    charset: 'utf8mb4_bin'
  });

  exports.login = async (req, res) =>{
      console.log(req.body)
      try {
          
        const { username, password, email } = req.body;

        if(!email || !password) {
            return res.status(400).render('login', {
                message: 'You need to give an email and password to get in.'
            })
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password) )){
            res.status(401).render('login', {
                message: 'Incorrect information mah dude.'
            })
        } else {
            const id = results[0].id;
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            console.log('the token is: ' + token);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKE_EXPIRE * 60 * 5
                ),
                httpOnly: true
            }
            res.cookie('BiscuitsIndustrialCookie', token, cookieOptions );
            res.status(200).redirect('/');
        }   
        })

      } catch (error) {
          console.log(error);
      }
  }

exports.register = (req, res) => {
    console.log(req.body);

    const { username, email, password, passwordVerify } = req.body;

    db.query('SELECT email FROM users WHERE email = ?',[email], async (error, results) => {
        if(error){
            console.error(error);
        }
        if( results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use, if this is wrong Poke SkippTekk on discord.'
            });
        } else if ( password !== passwordVerify) {
            return res.render('register', {
                message: 'That password isn\'t correct. Fix it'
            }); 
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        res.send('Registration complete.')

        db.query('INSERT INTO users SET ?', {username: username, email: email, password: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error)
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registered'
                })
            }
        })
    });

    // res.send('Form submitted');
};