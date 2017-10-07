const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const addStory = function (story) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO story SET ?', story,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getStory = function (storyId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM story where storyId = ' + storyId,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const updateStory = function (story) {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE story SET ? WHERE storyId = ?", [story, story.storyId],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }else {
                    resolve(results);
                }
            });
    });
};

const getStories = function (filter) {
    let sql = 'SELECT * FROM story ';

    if(filter.storyId !== null){
        sql += 'WHERE storyId = ' + filter.storyId;
    }else{

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


module.exports = {
    addStory,
    getStory,
    getStories,
    updateStory
};