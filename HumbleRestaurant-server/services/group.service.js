const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const addGroup = function (group) {
    delete group.groupId;
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO userGroup SET ? ', group,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getGroup = function (ownerId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM userGroup where ownerId = ' + mysql.escape(ownerId),
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getGroups = function (filter) {
    let sql = 'SELECT * FROM userGroup ';

    if(filter.keyword !== null){
        sql += ' WHERE name LIKE ' + mysql.escape('%' + filter.keyword + '%');
        sql += ' OR zipCode LIKE ' + mysql.escape('%' + filter.keyword + '%');
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

const getUserGroups = function (userId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT userGroup.* FROM groupUser, userGroup where groupUser.userId = ' + mysql.escape(userId)
                    + 'and groupUser.ownerId = userGroup.ownerId',
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const updateGroup = function (group) {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE userGroup SET ? WHERE ownerId = ?", [group, group.ownerId],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getGroupUsers = function (ownerId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM groupUser WHERE ownerId = ? ', ownerId,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const addGroupUser = function (data) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO groupUser SET ? ', data,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    connection.query('UPDATE userGroup SET users = users + 1 WHERE ownerId = ? ', data.ownerId);
                    resolve(results);
                }
            });
    });
};

const deleteGroupUser = function (userId, ownerId) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM groupUser WHERE userId = ? and ownerId = ?',
            [userId, ownerId],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    connection.query('UPDATE userGroup SET users = users - 1 WHERE ownerId = ?', ownerId);
                    resolve(results);
                }
            });
    });
};


module.exports = {
    addGroup,
    getGroup,
    getGroups,
    getUserGroups,
    updateGroup,
    getGroupUsers,
    addGroupUser,
    deleteGroupUser,
};