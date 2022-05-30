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
module.exports = {
  validateTransactionExistsById
}