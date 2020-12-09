const express = require('express');
// const { User } = require('../schemas/user');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.route('/').get(isAuth, async (req, res, next) => {
  try {
    if (req.user) {
      await res.render('main', {
        user: {
          email: req.user.email,
          nickName: req.user.nickName,
          userName: req.user.userName,
          phoneNum: req.user.phoneNum,
          dateOfBirth: req.user.dateOfBirth,
        },
      });
    } else {
      await res.render('main');
    }
  } catch (error) {
    console.error(error);
    next(err);
  }
});

module.exports = router;
