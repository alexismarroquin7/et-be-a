const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function generateJsonWebToken(payload, options){
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

function generateJsonWebTokenForUser(user){
  const { properties } = user;
  const payload = {
    subject: user.id,
    email: properties.email.email,
    role: properties.role.select.name
  };

  const options = {
    expiresIn: '1d'
  };

  const token = generateJsonWebToken(payload, options);
  
  return token;
}

function generateJsonWebTokenToRegister ({ subject = '', email = '' }) {
  const payload = {
    subject,
    email
  };

  const options = {
    expiresIn: '1d'
  };

  const token = generateJsonWebToken(payload, options);
  
  return token;
}

module.exports = {
  generateJsonWebTokenToRegister,
  generateJsonWebTokenForUser,
  generateJsonWebToken
}