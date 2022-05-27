const router = require('express').Router();
const TransactionCategory = require('./transaction_categories-model');

router.get(
  '/', 
  async (req, res, next) => {
    try {
      const trxCats = await TransactionCategory.findAll();
      res.status(200).json(trxCats);
    } catch (err) {
      next(err);
    }
  }
);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;