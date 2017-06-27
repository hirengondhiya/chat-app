var loadEnv = require('./env/load-environment');

var express = require('express');
const path = require('path');

var app = express();
const publicFolder = path.join(__dirname, '../public');

app.use(express.static(publicFolder));

app.listen(process.env.PORT, () => {
    console.log(`******** Server is up on port: ${process.env.PORT} ********`);
});

