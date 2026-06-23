const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const walletService = require('../services/walletService');
const { getBalance } = require('../services/walletService');


router.get('/balance',protect,async(req,res)=>{
    try {
        const data = await walletService.getBalance(req.user.userId);
        res.json({balance: data.balance, name: data.name});
    } catch(err){
        res.status(400).json({error: err.message});
    }

});

router.post('/deposit',protect,async(req,res)=>{
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

router.post('/withdraw',protect,async(req,res)=>{
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
})

module.exports = router;