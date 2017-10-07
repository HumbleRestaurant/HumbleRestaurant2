const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const getUser = function (userId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user where userId = ' + mysql.escape(userId),
            (error, results, fields) => {
            if (error) {
                reject(error);
            }else {
                resolve(results);
            }
        });
    });
};

const getUsers = function (filter) {
    let sql = 'SELECT * FROM user ';

    if(filter.userId !== null){
        sql += 'WHERE userId = ' + mysql.escape(filter.userId);
    }else{
        if(filter.keyword !== null){
            sql += ' WHERE name LIKE ' + mysql.escape('%' + filter.keyword + '%');
            sql += ' OR email LIKE ' + mysql.escape('%' + filter.keyword + '%');
            sql += ' OR role LIKE ' + mysql.escape('%' + filter.keyword + '%');
        }

        if(filter.sortBy !== null){
            sql += ' ORDER BY ' + filter.sortBy + ' DESC ';
        }

        if(filter.page === null){
            filter.page = 1;
        }

        let sIndex = (+filter.page - 1) * 10;
        let eIndex = (+filter.page) * 10;

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

const addUser = function (user) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO user SET ? ', user,
            (error, results, fields) => {
            if (error) {
                reject(error);
            }else {
                resolve(results);
            }
        });
    });
};

const updateUser = function (user) {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE user SET ? WHERE userId = ?", [user, user.userId],
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
    getUser,
    getUsers,
    addUser,
    updateUser
};