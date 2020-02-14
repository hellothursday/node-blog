const env = process.env.NODE_ENV
let MYSQL_CONFIG = {}
let REDIS_CONFIG = {}

if (env === 'dev') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '123',
        port: '8889',
        database: 'myblog'
    }
    REDIS_CONFIG = {
        port: 6379,
        host: 'localhost'
    }
}

if (env === 'production') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '123',
        port: '8889',
        database: 'myblog'
    }
    REDIS_CONFIG = {
        port: 6379,
        host: 'localhost'
    }
}

module.exports = {
    MYSQL_CONFIG,
    REDIS_CONFIG
}