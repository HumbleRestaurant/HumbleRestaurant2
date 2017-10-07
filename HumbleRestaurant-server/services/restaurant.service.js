const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const getRestaurant = function (ownerId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM restaurant where ownerId = ' + mysql.escape(ownerId),
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getRestaurants = function (filter) {
    let sql = 'SELECT * FROM restaurant ';

    if(filter.ownerId !== null){
        sql += 'WHERE ownerId = ' + mysql.escape(filter.ownerId);
    }else{
        if(filter.keyword !== null && filter.geohash !== null){
            sql += 'WHERE name LIKE ' + mysql.escape('%' + filter.keyword + '%');
            sql += 'AND geohash LIKE ' + mysql.escape(filter.geohash + '%');
        } else if(filter.keyword !== null){
            sql += 'WHERE name LIKE ' + mysql.escape('%' + filter.keyword + '%');
        } else if(filter.geohash !== null){
            sql += 'WHERE geohash LIKE ' + mysql.escape(filter.geohash + '%');
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

const updateRestaurant = function (restaurant) {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE restaurant SET ? WHERE ownerId = ?", [restaurant, restaurant.ownerId],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const addRestaurant = function (restaurant) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO restaurant SET ? ', restaurant,
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
    getRestaurant,
    getRestaurants,
    updateRestaurant,
    addRestaurant
};