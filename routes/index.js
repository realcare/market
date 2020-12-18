const express = require('express');
const { User } = require('../modules/user');
const { Product } = require('../modules/product');
const { Room } = require('../modules/room');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', isAuth, async (req, res, next) => {
  try {
    const alertProduct = await Room.findOne({ alert: true }).populate(
      'productItem'
    );

    const latestProduct = {
      name: '최신 상품',
      arr: await Product.find({}).sort({ createAt: -1 }).limit(9),
    };

    const viewsProduct = {
      name: '조회수 높은 순',
      arr: await Product.find({}).sort({ views: -1 }).limit(9),
    };

    if (!req.user) {
      return res.render('main', {
        productsList: [latestProduct, viewsProduct],
      });
    } else {
      if (!alertProduct) {
        return res.render('main', {
          user: req.user,
          productsList: [latestProduct, viewsProduct],
        });
      } else {
        if (req.user.id != alertProduct.productItem.author) {
          return res.render('main', {
            user: req.user,
            productsList: [latestProduct, viewsProduct],
          });
        } else {
          return res.render('main', {
            user: req.user,
            productsList: [latestProduct, viewsProduct],
            alertProduct,
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
