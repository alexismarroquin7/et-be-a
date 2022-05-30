const router = require('express').Router();

const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const transactionsRouter = require('./transactions/transactions-router');
const transactionCategoriesRouter = require('./transaction_categories/transaction_categories-router');
const transactionTypesRouter = require('./transaction_types/transaction_types-router');
const { restricted } = require('./auth/auth-middleware');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/transactions', restricted, transactionsRouter);
router.use('/transaction_categories', transactionCategoriesRouter);
router.use('/transaction_types', transactionTypesRouter);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;