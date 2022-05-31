const router = require('express').Router();
const { validateTransactionExistsById, validateTransactionRequiredFields } = require('./transactions-middleware');
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

router.get('/:transaction_id', validateTransactionExistsById, (req, res) => {
  res.status(200).json(req.transaction);
});

router.post(
  '/',
  validateTransactionRequiredFields,
  async (req, res, next) => {
    try {
      const trx = await Transaction.create(req.body);
      res.status(201).json(trx);
    } catch (err) {
      next(err);
    }
  }
)

router.put(
  '/:transaction_id',
  validateTransactionExistsById,
  validateTransactionRequiredFields,
  async (req, res, next) => {
    try {
      const transaction = await Transaction.updateById(req.params.transaction_id, req.body);
      res.status(200).json(transaction);
    } catch (err) {
      next(err);
    }
  }
)

router.delete(
  '/:transaction_id',
  validateTransactionExistsById,
  async (req, res, next) => {
    try {
      const trx = await Transaction.deleteById(req.transaction.id);
      res.status(200).json(trx);
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