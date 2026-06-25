const express = require('express');
const router  = express.Router();
const protect = require('../middleware/auth');
const Transaction = require('../models/transaction');
const mongoose = require('mongoose');

router.get('/summary', protect, async (req,res)=> {
    try{
        const {month , year} = req.query;

        if (!month || !year){
            return res.status(400).json({ error: 'Month & Year are required' });
        }

        const start = new Date(year, month-1,1);
        const end = new Date(year,month,1);

        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.userId),
                    createdAt: {$gte: start,$lt: end}
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: {$sum: '$amount'},
                    count: {$sum: 1}
                }
            },
            {
                $sort: {total: -1}
            }
        ]);
         const credit = summary.find(s => s._id === 'credit')?.total || 0;
    const debit  = summary.find(s => s._id === 'debit')?.total  || 0;

    res.json({
      month: Number(month),
      year:  Number(year),
      summary,
      net: credit - debit,    // positive = saved money, negative = overspent
      totalIn:  credit,
      totalOut: debit
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/category-breakdown', protect, async(req,res)=>{
    try{
        const breakdown = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.userId),
                    type: 'debit'
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: {$sum: '$amount'},
                    count: {$sum: 1},
                    avgAmount: {$avg: '$amount'}
                }
            },
            {
                $sort: {total: -1}
            }
        ]);
        res.json({breakdown});
    } catch(err){
        res.status(500).json({error: err.message});
    }
  
});


router.get('/balance-history', protect, async(req,res)=>{
    try{
        const days = parseInt(req.query.days) || 30;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const history = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
          createdAt: { $gte: since }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          closingBalance: { $last:  '$balanceAfter' },
          totalIn:  { $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0] }},
          totalOut: { $sum: { $cond: [{ $eq: ['$type', 'debit']  }, '$amount', 0] }}
        }
      },
      { $sort: { _id: 1 } }  
    ]);

    res.json({ days, history });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;