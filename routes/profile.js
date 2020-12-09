const express = require('express');
const { User } = require('../schemas/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', isAuth, async (req, res, next) => {
  try {
    await res.render('profile', {
      user: {
        email: req.user.email,
        nickName: req.user.nickName,
        userName: req.user.userName,
        phoneNum: req.user.phoneNum,
        dateOfBirth: req.user.dateOfBirth,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/delete', isAuth, async (req, res, next) => {
  await User.findByIdAndDelete({ _id: req.user._id }, (err, user) => {
    if (err) return next(err);
    return res.send(
      '<script type="text/javascript">alert("회원탈퇴가 완료되었습니다 ."); window.location="/"; </script>'
    );
  });
});

router
  .route('/update')
  .get(isAuth, async (req, res, next) => {
    try {
      if (req.user) {
        return res.render('profileUpdate', {
          user: req.user,
        });
      } else {
        return res.send(
          '<script type="text/javascript">alert("로그인된 회원이 아닙니다 ."); window.location="/"; </script>'
        );
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .post(isAuth, async (req, res, next) => {
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { User: req.body },
      (err) => {
        if (err) return next(err);
        return res.send(
          '<script type="text/javascript">alert("회원정보 수정완료 했습니다 ."); window.location="/"; </script>'
        );
      }
    );
  });

module.exports = router;
