const router = require('express').Router();
const TransactionType = require('./transaction_types-model');

router.get(
  '/', 
  async (req, res, next) => {
    try {
      const trxTypes = await TransactionType.findAll();
      res.status(200).json(trxTypes);
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