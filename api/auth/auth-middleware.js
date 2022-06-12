const User = require('../users/users-model');
const bcrypt = require('bcryptjs');
const { generateJsonWebTokenToRegister } = require('../../utils/generate-jwt');
const { sendRegisterEmail: handleRegisterEmail } = require('../../utils/send-mail');

const restricted = (req, res, next) => {
  if(req.session.user){
    next();
  } else {
    next({
      status: 401,
      message: 'You are not logged in or your session has expired.'
    });
  }
};

const only = () => {};

const validateNewUserRequiredFields = () => {};

const validateNewUserEmailUnique = () => {};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  const valid = bcrypt.compareSync(password, req.user.properties.password.rich_text[0].text.content);
  
  if(valid){
    req.session.user = req.user;
    next();
  
  } else {
    next({
      status: 400,
      message: "incorrect password"
    });
  }
};

const validateLoginRequiredFields = (req, res, next) => {
  const { login, password } = req.body;
  
  if(!login||!password){
    next({
      message: 'login and password are required',
      status: 400
    })
  } else {
    next();
  }

};

const validateUserExists = async (req, res, next) => {
  const { login } = req.body;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isEmail = emailRegex.test(login);
  
  if(isEmail){
    try {
      const user = await User.findByEmail(login);
      if(user){
        req.user = user;
        next();
      } else {
        next({
          message: 'user does not exist',
          status: 404
        });

      }
    } catch (err) {
      next(err);
    }
    
  } else {
    try {
      const user = await User.findByUserID(login);
    
      if(user){
        req.user = user;
        next();
      } else {
        next({
          message: 'user does not exist',
          status: 404
        });
      }
    } catch (err) {
      next(err);
    }
    
  }
};

const handlePasswordHash = (req, res, next) => {
  const { password } = req.body;
  try {
    const rounds = Number(process.env.DB_ROUNDS) || 8;
    const hash = bcrypt.hashSync(password, rounds);
    if(hash){
      req.hash = hash;
      next();
    } else {
      next({ status: 500, message: "an error occured while hashing password" })
    }
  } catch (err) {
    next(err);
  }
}

const validateRegisterRequestRequiredFields = (req, res, next) => {
  const { email } = req.body;

  if(typeof email === "undefined" || email.length === 0){
    next({
      status: 400,
      message: 'email is required'
    });
  } else {
    next();
  }

}

const handleRegisterJWT = async (req, res, next) => {
  const { email } = req.body;

  const token = generateJsonWebTokenToRegister({
    subject: email,
    email
  });

  req.token = token;
  next();
}

const sendRegisterEmail = async (req, res, next) => {
  try {
    
    await handleRegisterEmail({
      to: req.body.email
    });
    
    next();

  } catch (err) {
    next(err);
  }
}

const validateEmailUnique = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if(!user){
      next();
    } else {
      next({
        status: 400,
        message: 'user already has an account'
      });
    }
  } catch (err) {
    next(err);
  }
}


module.exports = {
  validatePassword,
  handlePasswordHash,
  restricted,
  only,
  validateNewUserRequiredFields,
  validateNewUserEmailUnique,
  validateLoginRequiredFields,
  validateUserExists,
  validateRegisterRequestRequiredFields,
  handleRegisterJWT,
  sendRegisterEmail,
  validateEmailUnique
}