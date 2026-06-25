const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { transactionValidator } = require('../middleware/validators');
const Transaction = require('../models/transaction');
const User = require('../models/user');

router.post('/add', protect, transactionValidator, validate, async(req,res) => {
    try{
        const {type,amount,category,description} = req.body;
        const userId = req.foundUser.userId;

        if (!type || !amount){
            return res.status(400).json({ error: 'Type and amount are required' });
        }

        if (!['credit','debit'].includes(type)){
             return res.status(400).json({ error: 'Type must be credit or debit' });
        }

        const foundUser = await User.findById(userId);

        if(!foundUser){
             return res.status(404).json({ error: 'User Not Found' });
        }

        if(type==='debit' && foundUser.balance<amount){
             return res.status(400).json({ error: 'Insufficient balance' });
        }

        if(type==='credit' ){
            foundUser.balance += amount;
        } else {
            foundUser.balance -= amount;
        }

        await foundUser.save();



        const newTransaction = await Transaction.create({
            foundUser: userId,
            type,
            amount,
            category: category || 'other',
            description,
            balanceAfter: foundUser.balance
        });

        res.status(201).json({
            message: 'Transaction logged successfully',
            transaction: newTransaction,
            newBalance: foundUser.balance
        });

    } catch(err) {
       res.status(500).json({error: err.message});
    }
});

router.get('/',protect,async(req,res)=>{
    try{
        const {page = 0, limit = 10, type, category} = req.query;
    

    const filter = {foundUser: req.foundUser.userId};
    if(type) filter.type = type;
    if(category) filter.category = category;

    const[transactions,total] = await Promise.all([
        Transaction.find(filter)
        .sort({createdAt: -1})
        .skip(Number(page) * Number(limit))
        .limit(Number(limit)),
        Transaction.countDocuments(filter)
    ]);


    res.json({
        transactions,
        total,
        pages: Math.ceil(total/Number(limit)),
        currentPage: Number(page)
    });

    } catch(err) {
        res.status(500).json({ error: err.message });
    }

});

module.exports = router;