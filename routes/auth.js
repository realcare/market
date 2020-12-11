const express = require('express');
const { User } = require('../modules/user');
const isAuth = require('../middleware/isAuth');
const middleMulter = require('../middleware/middleMulter');

const router = express.Router();

router.get('/', isAuth, (req, res, next) => {
  try {
    if (req.user) {
      return res.send(
        '<script type="text/javascript">alert("이미 로그인 되었습니다."); window.location="/"; </script>'
      );
    } else res.render('auth');
  } catch (error) {
    console.error(error);
    next(err);
  }
});

router.post(
  '/register',
  middleMulter('profileImg').single('profileImg'),
  async (req, res, next) => {
    const finduser = await User.findOne({ email: req.body.email });
    if (finduser) {
      return res.send(
        '<script type="text/javascript">alert("이미 가입된 회원입니다.");window.location="/auth";</script>'
      );
    }
    const img = req.file.path.slice('6');
    const emailPatten = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const pwPatten = /^[A-Za-z0-9]{6,12}$/;
    const phoneNumPatteen = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g;
    if (emailPatten.test(req.body.email) == false) {
      return res.send(
        '<script type="text/javascript">alert("적합하지 않은 이메일 형식입니다.");window.location="/auth";</script>'
      );
    }
    if (pwPatten.test(req.body.password) == false) {
      return res.send(
        '<script type="text/javascript">alert("8~10자 영문, 숫자.");window.location="/auth";</script>'
      );
    }
    if (phoneNumPatteen.test(req.body.phoneNum) == false) {
      return res.send(
        '<script type="text/javascript">alert("적합하지 않은 핸드폰 번호 형식입니다.");window.location="/auth";</script>'
      );
    }
    const user = await new User({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
      nickName: req.body.nickName,
      phoneNum: req.body.phoneNum,
      profileImg: img,
    });

    await user.save((err, userInfo) => {
      if (err) return next(err);
      return res.send(
        '<script type="text/javascript">alert("회원가입이 완료되었습니다."); window.location="/auth"; </script>'
      );
    });
  }
);

router.post('/login', async (req, res, next) => {
  try {
    await User.findOne({ email: req.body.email }, async (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.send(
          '<script type="text/javascript">alert("해당하는 Email이 없습니다."); window.location="/auth"; </script>'
        );
      }
      user.comparePassword(req.body.password, async (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch)
          return res.send(
            '<script type="text/javascript">alert("비밀번호가 틀렸습니다."); window.location="/auth"; </script>'
          );
        user.generateToken((err, user) => {
          if (err) return next(err);
          //토큰을 저장한다.
          return res.cookie('x_auth', user.token).status(200).redirect(`/`);
        });
      });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/logout', isAuth, async (req, res, next) => {
  await User.findByIdAndUpdate(
    { _id: req.user._id },
    { token: '' },
    (err, user) => {
      if (err) return next(err);
      res.clearCookie('x_auth');
      return res.status(200).redirect('/');
    }
  );
});

module.exports = router;
