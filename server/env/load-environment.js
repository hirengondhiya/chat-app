module.exports.loadEnvironment = () => {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'development' || env === 'test') {
        const envConfig = require('./environment.json')[env];

        for (const key in envConfig) {
            if (envConfig.hasOwnProperty(key)) {
                process.env[key] = envConfig[key];
            }
        }
    }
};
