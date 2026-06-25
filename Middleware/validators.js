const { body } = require('express-validator');

const registerValidator = [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({min: 2}).withMessage('Name must be atleast 2 characters'),

    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid Email.format')
      .normalizeEmail(),

    body('password')
       .notEmpty().withMessage('Password is required')
       .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
       .matches(/\d/).withMessage('Password must contain at least one number')
  
];

const loginValidator = [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid Email.format')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password is required')

];

const amountValidator = [
    body('amount')
       .notEmpty().withMessage('Amount is required')
       .isFloat({ min: 1 }).withMessage('Amount must be a number greater than 0')

];

const transferValidator = [
    body('receiverEmail') 
       .trim()
       .notEmpty().withMessage('Receiver Email is required')
       .isEmail().withMessage('Invalid receiver Email format')
       .normalizeEmail(),
       
    body('amount')
       .notEmpty().withMessage('Amount is required')
       .isFloat({ min: 1 }).withMessage('Amount must be a number greater than 0')

];


const transactionValidator = [
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['credit', 'debit']).withMessage('Type must be credit or debit'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 1 }).withMessage('Amount must be a number greater than 0'),

  body('category')
    .optional()
    .isIn(['food', 'transport', 'salary', 'shopping', 'other'])
    .withMessage('Invalid category'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Description max 100 characters')
];


module.exports = {
    registerValidator,
    loginValidator,
    amountValidator,
    transferValidator,
     transactionValidator
};

