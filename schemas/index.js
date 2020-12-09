const mongoose = require('mongoose');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
};

mongoose.connect(
  'mongodb://Lee:1234@localhost:27017/admin',
  {
    dbName: 'market',
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log('몽고디비 연결 에러', err);
    } else {
      console.log('몽고디비 연결 성공');
    }
  }
);

const db = mongoose.connection;

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다');
  connect();
});

module.exports = connect;
