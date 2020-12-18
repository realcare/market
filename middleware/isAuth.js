const { User } = require('../modules/user');
const { Product } = require('../modules/product');

const isAuth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  let _url = req.url;

  //인증처리기
  //클라이언트에서 token을 가져와서 복호화 한후 user를 찾는다
  // user가 있으면 인증 없으면 인증 x

  if (_url === '/') {
    await User.findByToken(token, (err, user) => {
      if (err) throw err;

      req.token = token;
      req.user = user;
      next();
    });
  } else {
    await User.findByToken(token, (err, user) => {
      if (err) throw err;
      if (!token) {
        return res.send(
          ` <script type="text/javascript">alert("로그인된 회원이 아닙니다."); window.location="/"; </script>`
        );
      }
      req.token = token;
      req.user = user;

      next();
    });
  }
};

module.exports = isAuth;
