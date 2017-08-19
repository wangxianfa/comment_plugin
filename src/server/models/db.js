const config = require('../../../config/db'),
      mongoose = require('mongoose'),
      DB_URL = config.adapter + '://' + config.uri;
      mongoose.Promise = global.Promise;
let mongoOptions = {useMongoClient: true};

if (DB_URL.indexOf('replicaSet') > -1) {
  mongoOptions = {
    db: { native_parser: true },
    replset: {
      auto_reconnect: false,
      poolSize: 10,
      socketOptions: {
        keepAlive: 1000,
        connectTimeoutMS: 30000,
      },
    },
    server: {
      poolSize: 5,
      reconnectTries: 10,
      socketOptions: {
        keepAlive: 1000,
        connectTimeoutMS: 30000,
      },
    },
    useMongoClient: true,
  };
}
    

/**
 * 进行连接
 */
var db = mongoose.connect(DB_URL, mongoOptions);

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + DB_URL);
})

/**
 * 连接异常
 */
mongoose.connection.on('error', function (error) {
  console.error('Mongoose connection error: ' + error);
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
  console.warn('Mongoose connection disconnected ');
})

module.exports = db;