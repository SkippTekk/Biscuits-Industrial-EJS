const mysql = require('mysql');
const { resolve } = require('path');
require('dotenv').config();
const connection = mysql.createPool({
    connectionLimit: 100,
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    charset: 'utf8mb4_bin'
});
connection.getConnection( (err) =>{
    if(err) {
      console.log(err)}
      else {
        console.log(`Connected to *` +process.env.MYSQL_DB +`* database /server/index.js`)
      }
  })


let invtypes = {};

invtypes.all = () => {

    return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM invTypes`, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results);
            });
    });
};
invtypes.id = (id) => {

    return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM invTypes WHERE typeID = ?`, id, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results[0]);
            });
    });
};
invtypes.ships = (ship) => {

    return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM invTypes WHERE typeName = ?`, ship, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results[0]);
            });
    });
};
invtypes.builds = (build) => {

    return new Promise((resolve, reject) => {
            connection.query(`SELECT m.materialTypeID, m.quantity, i2.typeName, m.activityID FROM industryActivityMaterials m INNER JOIN invTypes i1 ON i1.typeID = m.typeID INNER JOIN invTypes i2 ON i2.typeID = m.materialtypeID INNER JOIN ramActivities i3 ON i3.activityID = m.activityID = 1 WHERE i1.typeName = ? AND m.activityID = 1 ORDER BY m.materialTypeID ASC`, build, (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results);
            });
    });
};
invtypes.shipinfo = () => {

    return new Promise((resolve, reject) => {
            connection.query("SELECT invGroup.`categoryID`, invType.* FROM `invTypes` invType INNER JOIN `invGroups` invGroup ON invGroup.`groupID` = invType.`groupID` WHERE `invGroup`.`categoryID` = '6'", (err, results) => {
                if(err){
                    return reject(err);
                }
                return resolve(results);
            });
    });
};

module.exports = invtypes;

// to add shit go to server -> routes -> index.js you dumb fuck (talking to Biscuits, not you public people)