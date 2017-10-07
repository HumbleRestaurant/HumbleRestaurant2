const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());
app.use(fileUpload());

app.get('/:filename', function (req, res) {
    res.sendFile(req.params.filename, {root: path.join(__dirname, '/resource/')});
});

app.post('/', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.file;
    var filename = req.body.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('resource/' + filename, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send({'path': 'http://165.227.57.73:3100/' + filename});
    });
});

app.listen(3100, function () {
    console.log('Image Server is listening on port 3100');
});