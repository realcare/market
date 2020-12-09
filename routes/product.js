const express = require('express');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { Product } = require('../modules/product');
const path = require('path');

try {
  fs.readdirSync('public/uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다');
  fs.mkdirSync('public/uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'public/uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', isAuth, async (req, res, next) => {
  try {
    await Product.find((err, products) => {
      if (err) return next(err);
      console.log('--------------------------');
      products.forEach((v) => {
        v.img[0];
        console.log(v.img[0]);
      });
      res.render('product', {
        user: {
          email: req.user.email,
          nickName: req.user.nickName,
          userName: req.user.userName,
          phoneNum: req.user.phoneNum,
          dateOfBirth: req.user.dateOfBirth,
        },
        products,
      });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router
  .route('/registration')
  .get(isAuth, (req, res, next) => {
    try {
      res.render('productRegistration', {
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
  })
  .post(isAuth, upload.array('productImg', 3), async (req, res, next) => {
    try {
      const imgs = req.files.map((v) => {
        v.path = v.path.slice(6);
        return v;
      });
      const product = await new Product({
        name: req.body.productName,
        price: parseInt(req.body.price),
        description: req.body.description,
        img: imgs,
        author: req.user._id,
      });
      product.save((err, productInfo) => {
        if (err) return next(err);
        return res.send(
          '<script type="text/javascript">alert("상품이 등록되었습니다."); window.location="/product"; </script>'
        );
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

router.get('/infomation', async (req, res, next) => {
  console.log(req.params._id);
  const product = await Product.findOne({ where: req.params._id });
  res.render('productInfo', { product });
});

module.exports = router;
