var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    var envConfig = require('./environment.json')[env];

    for (key in envConfig) {
        process.env[key] = envConfig[key];
    }
}