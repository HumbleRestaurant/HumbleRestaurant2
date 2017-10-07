const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const addPayment = function (payment) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO payment SET ?', payment,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getPayment = function (paymentId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM payment where paymentId = ' + paymentId,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const updatePayment = function (payment) {
    delete payment.date;
    return new Promise((resolve, reject) => {
        connection.query("UPDATE payment SET ? WHERE paymentId = ?", [payment, payment.paymentId],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    if(payment.status === 1){
                        updateRestaurant(payment.restaurantId, payment.donation);
                        updateUser(payment.userId, payment.donation);
                        updateGroup(payment.userId, payment.donation);
                    }
                    resolve(results);
                }
            });
    });
};

const updateRestaurant = function (ownerId, donation) {
    connection.query('UPDATE restaurant SET donation = donation + ? , funds = funds - ? WHERE ownerId = ?',
        [donation, donation, ownerId],
        (error, results, fields) => {
            if(error){
                console.log(error);
            }
        });
};

const updateUser = function (userId, donation) {
    connection.query('UPDATE user SET donation = donation + ? , payment = payment + 1 , foodie = foodie + ? WHERE userId = ?',
        [donation, donation, userId],
        (error, results, fields) => {
            if(error){
                console.log(error);
            }
        });
};

const updateGroup = function (userId, donation) {
    connection.query('UPDATE userGroup ' +
        'JOIN groupUser ON groupUser.ownerId = userGroup.ownerId AND groupUser.userId = ? ' +
        'SET userGroup.donation = userGroup.donation + ?',
        [userId, donation],
        (error, results, fields) => {
            if(error){
                console.log(error);
            }
        });
};

const getPayments = function (filter) {
    let sql = 'SELECT * FROM payment ';

    if(filter.paymentId !== null){
        sql += 'WHERE paymentId = ' + filter.paymentId;
    }else{
        if(filter.userId !== null){
            if(filter.userId.indexOf(',') > -1)
                sql += 'WHERE userId in (' + filter.userId + ')';
            else
                sql += 'WHERE userId in (' + mysql.escape(filter.userId) + ')';
        }else if(filter.restaurantId !== null){
            sql += 'WHERE restaurantId = ' + mysql.escape(filter.restaurantId);
        }

        if(filter.page === null){
            filter.page = 1;
        }

        let sIndex = (+filter.page - 1) * 10;
        let eIndex = (+filter.page) * 10;

        sql += ' ORDER BY date DESC';
        sql += ' LIMIT ' + sIndex + ',' + eIndex;
    }

    return new Promise((resolve, reject) => {
        connection.query(sql,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

module.exports = {
    addPayment,
    getPayment,
    getPayments,
    updatePayment
};