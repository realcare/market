const express = require('express');
const { User } = require('../schemas/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// router.post('/register', async (req, res, next) => {
//   //회원가입할때 필요한 정보들을 웹에서 가져오면 데이터베이스에 넣음
//   console.log(req.body);
//   const {
//     email,
//     password,
//     userName,
//     nickName,
//     phoneNum,
//     dateOfBirth,
//   } = req.body;
//   try {
//     const user = await User.create({
//       email,
//       password,
//       userName,
//       nickName,
//       phoneNum,
//       dateOfBirth,
//     });
//     console.log(user);
//     return res.redirect('/auth');
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

router.get('/', async (req, res, next) => {
  try {
    await res.render('auth');
  } catch (error) {
    console.error(error);
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  const user = await new User(req.body);
  await user.save((err, userInfo) => {
    if (err) return next(err);
    return res.send(
      '<script type="text/javascript">alert("회원가입이 완료되었습니다."); window.location="/auth"; </script>'
    );
  });
});

router.route('/login').post(async (req, res, next) => {
  try {
    await User.findOne({ email: req.body.email }, async (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.send(
          '<script type="text/javascript">alert("해당하는 Email이 없습니다."); window.location="/auth"; </script>'
        );
      }
      await user.comparePassword(req.body.password, async (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch)
          return res.send(
            '<script type="text/javascript">alert("비밀번호가 틀렸습니다."); window.location="/auth"; </script>'
          );
        await user.generateToken((err, user) => {
          if (err) return next(err);
          //토큰을 저장한다.
          res.cookie('x_auth', user.token).status(200).redirect('/');
        });
      });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/logout', isAuth, async (req, res, next) => {
  await User.findOneAndUpdate(
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
