const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const addRating = function (rating) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO rating SET ?', rating,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                    updateRestaurant(rating);
                    updateUser(rating);
                }
            });
    });
};

const updateRestaurant = function (rating) {
    sql = 'UPDATE restaurant SET rating = ((reviews * rating) + ?)/(reviews + 1) , reviews = reviews + 1 WHERE ownerId = ?';
    connection.query(sql, [rating.score, rating.restaurantId],
        (error, results, fields) => {});
};

const updateUser = function (rating) {
    sql = 'UPDATE user SET comment = comment + 1 WHERE userId = ?';
    connection.query(sql, [rating.userId],
        (error, results, fields) => {});
};

const getRating = function (ratingId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM rating where ratingId = ' + ratingId,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const updateRating = function (rating) {
    delete rating.date;
    return new Promise((resolve, reject) => {
        connection.query("UPDATE rating SET ? WHERE ratingId = ?", [rating, rating.ratingId],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getRatings = function (filter) {
    let sql = 'SELECT * FROM rating ';

    if(filter.ratingId !== null){
        sql += 'WHERE ratingId = ' + filter.ratingId;
    }else{
        if(filter.userId !== null){
            sql += 'WHERE userId = ' + mysql.escape(filter.userId);
        }else if(filter.restaurantId !== null){
            sql += 'WHERE restaurantId = ' + mysql.escape(filter.restaurantId);
        }

        if(filter.page === null){
            filter.page = 1;
        }

        let sIndex = (+filter.page - 1) * 10;
        let eIndex = (+filter.page) * 10;

        if(filter.sortBy === null) {
            sql += ' ORDER BY date DESC';
        }else {
            sql += ' ORDER BY ' + filter.sortBy + ' DESC';
        }
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
    addRating,
    getRating,
    getRatings,
    updateRating
};