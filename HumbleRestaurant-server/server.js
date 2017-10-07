const express = require('express');
const app = express();
const path = require('path');

const restRouter = require('./routes/rest');
const indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname,'../HumbleRestaurant-release/')));
app.use('/', indexRouter);
app.use('/api/v1', restRouter);
app.use(function (req, res, next) {
   res.sendFile('index.html', {root: path.join(__dirname, '../HumbleRestaurant-release/')});
});

app.listen(3000, function () {
   console.log('Humble Restaurant server listening on port 3000.');
});