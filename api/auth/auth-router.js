const router = require('express').Router();

const {
  validatePassword,
  validateLoginRequiredFields,
  validateUserExists,
  validateRegisterRequestRequiredFields,
  handleRegisterJWT,
  sendRegisterEmail,
  validateEmailUnique
} = require('./auth-middleware');

router.post(
  '/register/request',
  validateRegisterRequestRequiredFields,
  validateEmailUnique,
  handleRegisterJWT,
  sendRegisterEmail,
  (req, res) => {
    res
    .status(200)
    .json({
      message: 'email sent!'
    });
  }
);

router.post(
  '/register',
  async (req, res, next) => {
    res.end();
  }
);

router.post(
  '/login',
  validateLoginRequiredFields,
  validateUserExists,
  validatePassword,
  (req, res) => {
    res.status(200).json({
      user: req.session.user,
      message: `Welcome back ${req.session.user.properties.userID.rich_text.length > 0 && req.user.properties.userID.rich_text[0].text.content}`,
    })
  }
);

router.get('/logout', (req, res, next) => {
  if(req.session.user){
    // logout
    req.session.destroy(err => {
      if(err){
        next({ message: 'session was not destroyed' });
      } else {
        res.status(200).json({ message: 'logged out' })
      }
    });
  } else {
    next({ status: 200, message: 'no session' });
  }
});


router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;