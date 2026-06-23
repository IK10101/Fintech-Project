const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Transaction = require('../models/transaction');
const User = require('../models/user');

router.post('/add',protect,async(req,res) => {
    try{
        const {type,amount,category,description} = req.body;
        const userId = req.user.userId;

        if (!type || !amount){
            return res.status(400).json({ error: 'Type and amount are required' });
        }

        if (!['credit','debit'].includes(type)){
             return res.status(400).json({ error: 'Type must be credit or debit' });
        }

        const user = await User.findById(userId);

        if(!user){
             return res.status(404).json({ error: 'User Not Found' });
        }

        if(type==='debit' && user.balance<amount){
             return res.status(400).json({ error: 'Insufficient balance' });
        }

        if(type==='credit' ){
            user.balance += amount;
        } else {
            user.balance -= amount;
        }

        await user.save();



        const newTransaction = await Transaction.create({
            user: userId,
            type,
            amount,
            category: category || 'other',
            description,
            balanceAfter: user.balance
        });

        res.status(201).json({
            message: 'Transaction logged successfully',
            transaction: newTransaction,
            newBalance: user.balance
        });

    } catch(err) {
       res.status(500).json({error: err.message});
    }
});

router.get('/',protect,async(req,res)=>{
    try{
        const {page = 0, limit = 10, type, category} = req.query;
    

    const filter = {user: req.user.userId};
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