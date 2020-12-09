const { User } = require('../schemas/user');

let auth = (req, res, next) => {
  //인증처리기
  //클라이언트에서 token을 가져와서 복호화 한후 user를 찾는다
  // user가 있으면 인증 없으면 인증 x
  let token = req.cookies.x_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = auth;
