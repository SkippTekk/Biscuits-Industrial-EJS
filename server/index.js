const mysql = require('mysql');
require('dotenv').config();
const pool = mysql.createPool({
    connectionLimit: 100,
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    charset: 'utf8mb4_bin'
});
pool.getConnection( (err) =>{
    if(err) {
      console.log(err)}
      else {
        console.log(`Connected to *` +process.env.MYSQL_DB +`* database /server/db/index.js`)
      }
  })


let invtypes = {};

invtypes.all = () => {

    return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM invTypes`, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results);
            });
    });
};
invtypes.id = (id) => {

    return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM invTypes WHERE typeID = ?`, id, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results[0]);
            });
    });
};
invtypes.ships = (ship) => {

    return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM invTypes WHERE typeName = ?`, ship, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results[0]);
            });
    });
};
invtypes.builds = (build) => {

    return new Promise((resolve, reject) => {
            pool.query(`SELECT m.materialTypeID, m.quantity, i2.typeName, m.activityID FROM industryActivityMaterials m INNER JOIN invTypes i1 ON i1.typeID = m.typeID INNER JOIN invTypes i2 ON i2.typeID = m.materialtypeID INNER JOIN ramActivities i3 ON i3.activityID = m.activityID = 1 WHERE i1.typeName = ? AND m.activityID = 1 ORDER BY m.materialTypeID ASC`, build, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results);
            });
    });
};

module.exports = invtypes;