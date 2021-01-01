require('dotenv').config()
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: 'mail.skipptekk.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.emailUsername,
    pass: process.env.emailPassword
  },
  tls: {
    rejectUnauthorized: false
  }

});
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

let mailinfo ={
  from: process.env.emailReturn + '@skipptekk.com',
  to: process.env.emailTest,
  subject: 'Testing email',
  cc: process.env.emailCC,
  html: 'This is a test email'
};

transporter.sendMail(mailinfo, (error, info) => {
  if (error) {
    console.log('error', error)
  } else {
    console.log('info', info)
  }
})