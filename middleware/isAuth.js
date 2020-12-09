const { User } = require('../schemas/user');

let isAuth = (req, res, next) => {
  let token = req.cookies.x_auth;

  //인증처리기
  //클라이언트에서 token을 가져와서 복호화 한후 user를 찾는다
  // user가 있으면 인증 없으면 인증 x

  User.findByToken(token, (err, user) => {
    if (err) throw err;

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = isAuth;
