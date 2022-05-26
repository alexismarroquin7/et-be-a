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
    email: properties.email,
    role: properties.role.name
  };

  const options = {
    expiresIn: '1d'
  };

  const token = generateJsonWebToken(payload, options);
  
  return token;
}

module.exports = {
  generateJsonWebTokenForUser,
  generateJsonWebToken
}