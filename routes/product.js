const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const middleMulter = require('../middleware/middleMulter');
const { Product } = require('../modules/product');

router.get('/', isAuth, async (req, res, next) => {
  try {
    await Product.find((err, products) => {
      if (err) return next(err);
      console.log('--------------------------');
      products.forEach((v) => {
        v.img[0];
        console.log(v.img[0]);
      });
      if (!req.user) {
        return res.render('main');
      } else {
        res.render('product', {
          user: {
            email: req.user.email,
            nickName: req.user.nickName,
            userName: req.user.userName,
            phoneNum: req.user.phoneNum,
          },
          products,
        });
      }
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
      
      if (req.user) {
        res.render('productRegistration', {
          user: {
            email: req.user.email,
            nickName: req.user.nickName,
            userName: req.user.userName,
            phoneNum: req.user.phoneNum,
          },
    
        });
      } else {
        return res.send(
          '<script type="text/javascript">alert("로그인된 회원이 아닙니다."); window.location="/product"; </script>'
        );
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .post(
    isAuth,
    middleMulter('productImg').array('productImg', 3),
    async (req, res, next) => {
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
          author: req.user.id,
        });
        product.save((err, productInfo) => {
          if (err) return next(err);
          return res.send(
            ` <script type="text/javascript">alert("상품이 등록되었습니다."); window.location="/product/${product.id}"; </script>`
          );
        });
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  );

router.get('/:id', isAuth, async (req, res, next) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    res.render('productDetail', { product, user: req.user });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router
  .route('/:id/update')
  .get(isAuth, async (req, res, next) => {
    try {
      const product = await Product.findById({ _id: req.params.id });
      res.render('productRegistration', { product, user: req.user });
    } catch (error) {
      console.error(error);
      next(err);
    }
  })
  .post(
    isAuth,
    middleMulter('productImg').array('productImg', 3),
    async (req, res, next) => {
      try {
        const imgs = req.files.map((v) => {
          v.path = v.path.slice(6);
          return v;
        });
        console.log('-------------');
        console.log(req.params);
        const product = await Product.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.productName,
            price: parseInt(req.body.price),
            description: req.body.description,
            img: imgs,
          },
          { new: true }
        );
        return res.send(
          ` <script type="text/javascript">alert("상품 정보가 변경되었습니다."); window.location="/product/${product.id}"; </script>`
        );
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  );

router.get('/:id/delete', async (req, res, next) => {
  try {
    await Product.findByIdAndDelete({ _id: req.params.id });
    return res.send(
      ` <script type="text/javascript">alert("상품이 삭제되었습니다."); window.location="/"; </script>`
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
