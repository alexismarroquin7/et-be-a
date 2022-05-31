const Transaction = require('./transactions-model');

const validateTransactionExistsById = async (req, res, next) => {
  const { transaction_id } = req.params;

  try {
    const transaction = await Transaction.findById(transaction_id);
    
    if(transaction){
      req.transaction = transaction;
      next();
    
    } else {
      next({
        message: 'transaction does not exist',
        status: 404
      });
    
    }

  } catch (err) {
    next(err);
  }
}

const validateTransactionRequiredFields = (req, res, next) => {
  const {
    name, /*
     * string is required
     * min_length === 0
    */

    description, /*
    * string is required
    * min_length === 0
    */ 
    category,
    date,
    amount,
    type,
    userUUID
  } = req.body;
  
  if(
    typeof date !== "string"
  ){
    next({
      status: 400,
      message: 'date must be of type "string"'
    });
  }

  if(
    typeof name !== "string"
  ){
    next({
      status: 400,
      message: 'name must be of type "string"'
    });
  }
  
  if(
    typeof description !== "string"
  ){
    next({
      status: 400,
      message: 'description must be of type "string"'
    });
  }
  
  if(
    typeof amount !== "number" &&
    typeof amount !== "string"
  ){
    next({
      status: 400,
      message: 'amount must be of type "number" or "string"'
    });
  } else if(Number(amount) <= 0){
    next({
      status: 400,
      message: 'amount cannot be less than or equal to 0'
    });
  }
  
  
  if(
    typeof type !== "string"
  ){
    next({
      status: 400,
      message: 'type must be of type "string"'
    });
  }
  
  if(
    typeof category !== "string"
  ){
    next({
      status: 400,
      message: 'category must be of type "string"'
    });
  }

  if(
    typeof userUUID !== "string" // user's page id
  ){
    next({
      status: 400,
      message: 'userUUID must be of type "string"'
    });
  }

  if(
    category.length === 0
  ) {
    next({
      status: 400,
      message: 'category is a required field'
    });
  }

  if(date.length === 0){
    next({
      status: 400,
      message: 'date is a required field'
    })
  }
  if(String(amount).length === 0){
    next({
      status: 400,
      message: 'amount is a required field'
    })
  }
  if(type.length === 0){
    next({
      status: 400,
      message: 'type is a required field'
    })
  }
  if(userUUID.length === 0){
    next({
      status: 400,
      message: 'type is a required field'
    })
  }

  next();
}

module.exports = {
  validateTransactionExistsById,
  validateTransactionRequiredFields
}