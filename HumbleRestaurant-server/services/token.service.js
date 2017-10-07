const secret = require('config').get('auth').get('secret');
const jwt = require('jwt-simple');

const dbConfig = require('config').get('db');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig);

const authToken = function (req, res, level , next) {
    // if('token' in req){
    //     const decode = jwt.decode(req.token, secret);
    //     const userId = decode.idTokenPayload.sub;
    //
    //     connection.query('SELECT role FROM user where userId = ' + userId,
    //         (error, results, fields) => {
    //             if (error || results.length == 0) {
    //                 res.status(400).send('Auth fail.');
    //             }else {
    //
    //             }
    //         });
    // }
};

const decodeToken = function (token) {
    return new Promise((resolve, reject) => {
        const decode = jwt.decode(token, secret);
        resolve(decode);
    });
};


module.exports = {
    authToken
};