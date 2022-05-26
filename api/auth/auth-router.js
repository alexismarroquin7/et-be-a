const router = require('express').Router();

const {
  validatePassword,
  handleJWT,
  validateLoginRequiredFields,
  validateUserExists
} = require('./auth-middleware');

router.post(
  '/register',
  async (req, res, next) => {

  }
);


router.post(
  '/login',
  validateLoginRequiredFields,
  validateUserExists,
  validatePassword,
  handleJWT,
  async (req, res, next) => {
    res.status(200).json({
      user: req.user,
      message: `Welcome back ${req.user.properties.userID}`,
      token: req.token
    })
  }
);

router.get('/logout', async (req, res, next) => {

});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;