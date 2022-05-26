const User = require('../users/users-model');
const bcrypt = require('bcryptjs');
const { generateJsonWebTokenForUser } = require('../../utils/generate-jwt');

const restricted = () => {};

const only = () => {};

const validateNewUserRequiredFields = () => {};

const validateNewUserEmailUnique = () => {};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  const valid = bcrypt.compareSync(password, req.user.properties.password);
  
  if(valid){
    next();
  
  } else {
    next({
      status: 400,
      message: "incorrect password"
    });
  }
};

const handleJWT = (req, res, next) => {
  try {
    const token = generateJsonWebTokenForUser(req.user);
    req.token = token;
    next();
  } catch (err) {
    next(err);
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


module.exports = {
  validatePassword,
  handlePasswordHash,
  handleJWT,
  restricted,
  only,
  validateNewUserRequiredFields,
  validateNewUserEmailUnique,
  validateLoginRequiredFields,
  validateUserExists,
}