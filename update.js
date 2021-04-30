const https = require('https');

const options = {
  hostname: 'www.fuzzwork.co.uk',
  port: 443,
  path: '/dump/mysql-latest.tar.bz2',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();