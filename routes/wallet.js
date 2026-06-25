const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const walletService = require('../services/walletService');
const { getBalance } = require('../services/walletService');
const validate = require('../middleware/validate');                          
const { amountValidator, transferValidator } = require('../middleware/validators'); 


router.get('/balance',protect,async(req,res)=>{
    try {
        const data = await walletService.getBalance(req.user.userId);
        res.json({balance: data.balance, name: data.name});
    } catch(err){
        res.status(400).json({error: err.message});
    }

});

router.post('/deposit', protect, amountValidator, validate,async(req,res)=>{
    try {
        const {amount,description} = req.body;
        const result = await walletService.deposit(
            req.user.userId,
            amount,
            description
        );
        res.status(201).json({
            message: 'Deposit Successful',
            ...result
        });
    } catch(err){
        res.status(400).json({error: err.message});
    }
});

router.post('/withdraw', protect, amountValidator, validate, async(req,res)=>{
    try {
        const {amount,description} = req.body;
        const result = await walletService.withdraw(
            req.user.userId,
            amount,
            description
        );
        res.status(201).json({
            message: 'Withdraw Successful',
            ...result
        });
    } catch(err){
        res.status(400).json({error: err.message});
    }
});

router.post('/transfer', protect,transferValidator, validate, async (req, res) => {
  try {
    const { receiverEmail, amount, description } = req.body;

    if (!receiverEmail)
      return res.status(400).json({ error: 'Receiver email is required' });

    const result = await walletService.transfer(
      req.user.userId,
      receiverEmail,
      amount,
      description
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;