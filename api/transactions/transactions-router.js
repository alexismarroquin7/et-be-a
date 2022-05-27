const router = require('express').Router();
const Transaction = require('./transactions-model')

router.get(
  '/',
  async (req, res, next) => {
    const { query, decodedToken } = req;

    try {
      const transactions = await Transaction.findAll({
        ...query,
        userUUID: decodedToken.role === 'user' 
        ? decodedToken.subject
        : query.userUUID
      });
      res.status(200).json(transactions);
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