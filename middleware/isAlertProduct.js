const { Room } = require('../modules/room');
const isAlertProduct = async (req, res, next) => {
  try {
    const alertProduct = await Room.findOne({ alert: true }).populate(
      'productItem'
    );
    if (alertProduct) {
      req.alertProduct = alertProduct;
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = isAlertProduct;
