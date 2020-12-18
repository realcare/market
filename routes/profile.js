const express = require('express');
const { User } = require('../modules/user');
const isAuth = require('../middleware/isAuth');
const middleMulter = require('../middleware/middleMulter');
const { Product } = require('../modules/product');
const isAlertProduct = require('../middleware/isAlertProduct');
const router = express.Router();

router.get('/', isAuth, isAlertProduct, async (req, res, next) => {
  try {
    const products = await Product.find({ author: req.user.id });

    if (products.length !== 0) {
      if (!req.alertProduct) {
        return res.render('profile', { user: req.user, products });
      } else {
        return res.render('profile', {
          user: req.user,
          products,
          alertProduct: req.alertProduct,
        });
      }
    } else {
      return res.render('profile', { user: req.user });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
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
          '<script type="text/javascript">alert("로그인된 회원이 아닙니다."); window.location="/"; </script>'
        );
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .post(
    isAuth,
    middleMulter('profileImg').single('profileImg'),
    async (req, res, next) => {
      try {
        let img;
        if (req.file) {
          img = req.file.path.slice('6');
        } else {
          img = '/image/noimg.jpg';
        }
        const user = await User.findOneAndUpdate(
          { _id: req.user._id },
          {
            userName: req.body.userName,
            nickName: req.body.nickName,
            phoneNum: req.body.phoneNum,
            profileImg: img,
          },
          { new: true }
        );
        return res.redirect('/profile');
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  );

router.get('/delete', isAuth, async (req, res, next) => {
  try {
    await Product.deleteMany({ author: req.user.id });
    await User.findByIdAndDelete({ _id: req.user.id });
    return res.send(
      '<script type="text/javascript">alert("회원탈퇴가 완료되었습니다 ."); window.location="/"; </script>'
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
