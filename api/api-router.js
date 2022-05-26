const router = require('express').Router();

const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;