const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);


const getDonors = function (duration, role) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM donor WHERE duration = ? and role = ? ORDER BY donation DESC',
            [duration, role],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const updateDonors = function (duration, role, donors) {

    let times = '';
    for (let i = 1; i < donors.length; i++) {
        times += ', (?)';
    }

    let sql = ' INSERT INTO donor (userId, name, donation, duration, role) VALUES ';

    for(let donor of donors) {
        sql += '(\'' + donor.userId + '\',\'' + donor.name + '\','
            + donor.donation + ',\'' + donor.duration + '\',\'' + donor.role + '\'),';
    }

    sql = sql.substr(0, sql.length - 1);

    return new Promise((resolve, reject) => {
        deleteDonors(duration, role)
            .then( (res) => {
                console.log('INSERT donor ' + duration + ' ' + role);
                connection.query( sql,
                    (error, results, fields) => {
                        if (error) {
                            reject(error);
                        }else {
                            resolve(results);
                        }
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const deleteDonors = function (duration, role) {
    console.log('DELETE donor ' + duration + ' ' + role);
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM donor where duration = ? and role = ?',
            [duration, role],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const generateDonors = function (duration, role) {
    return new Promise((resolve, reject) => {
        connection.query(generateSQL(duration, role),
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {

                    for(let donor of results) {
                        donor.duration = duration;
                        donor.role = role;
                    }

                    resolve(results);
                }
            });
    });
};

const generateSQL = function (duration, role) {
  let sql = '';

  let timePart = '';
  switch (duration) {
      case 'day':
          timePart = ' date(payment.date) = curdate() ';
          break;
      case 'week':
          timePart = ' DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(payment.date) ';
          break;
      case 'month':
          timePart = ' DATE_SUB(CURDATE(), INTERVAL 1 MONTH) <= date(payment.date) ';
          break;
  }

  switch (role) {
      case 'user':
            sql = 'select payment.userId as userId, user.name as name, SUM(payment.donation) as donation ' +
              'from payment, user ' +
              'where user.userId = payment.userId and ' + timePart + ' group by userId LIMIT 10';
          break;
      default:
            sql = 'select payment.restaurantId as userId, restaurant.name as name, SUM(payment.donation) as donation ' +
                'from payment, restaurant ' +
                'where restaurant.ownerId = payment.restaurantId and ' + timePart + ' group by restaurantId LIMIT 10';
          break;
  }

  return sql;
};

module.exports = {
    getDonors,
    generateDonors,
    updateDonors
};