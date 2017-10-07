const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const deleteFavorite = function (userId, ownerId) {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM favorite WHERE userId = ? and ownerId = ?",
            [userId, ownerId],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    updateRestaurant(ownerId, '-');
                    resolve(results);
                }
            });
    });
};

const addFavorite = function (favorite) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO favorite SET ?', favorite,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    updateRestaurant(favorite.ownerId, '+');
                    resolve(results);
                }
            });
    });
};

const updateRestaurant = function (ownerId, operate) {
    connection.query('UPDATE restaurant SET favs = favs ' + operate + ' 1 WHERE ownerId = ?', ownerId,
        (error, results, fields) => {});
};

const getFavorites = function (filter) {
    let sql = ' SELECT * FROM favorite ';

    if(filter.userId.indexOf(',') > -1) {
        sql +=  ' WHERE userId in (' + filter.userId + ')';
    } else {
        sql +=  ' WHERE userId in (' + mysql.escape(filter.userId) + ')';
    }

    if(filter.ownerId !== null){
        sql += ' AND ownerId = ' + mysql.escape(filter.ownerId);
    }

    console.log(sql);

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
    addFavorite,
    deleteFavorite,
    getFavorites
};