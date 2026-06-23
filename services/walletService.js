const User = require('../models/user')
const Transaction = require('../models/transaction');

const walletService = {
   async getBalance(userId) {
    const foundUser = await User.findById(userId).select('balance name');
    if (!foundUser) throw new Error('User not found');
    return foundUser;
},

async deposit(userId, amount, description = 'Deposit') {
    if (!amount || amount <= 0)
      throw new Error('Amount must be greater than 0');

    const foundUser = await User.findById(userId);
    if (!foundUser) throw new Error('User not found');

    foundUser.balance += Number(amount);
    await foundUser.save();

    const newTransaction = await Transaction.create({
      user: userId,
      type: 'credit',
      amount,
      description,
      category: 'other',
      balanceAfter: foundUser.balance
    });

    return { newTransaction, newBalance: foundUser.balance };
},

async withdraw(userId, amount, description = 'Withdrawal') {
    if (!amount || amount <= 0)
      throw new Error('Amount must be greater than 0');

    const foundUser = await User.findById(userId);
    if (!foundUser) throw new Error('User not found');

    if (foundUser.balance < amount)
      throw new Error('Insufficient funds');

    foundUser.balance -= Number(amount);
    await foundUser.save();

    const newTransaction = await Transaction.create({
      user: userId,
      type: 'debit',
      amount,
      description,
      category: 'other',
      balanceAfter: foundUser.balance
    });

    return { newTransaction, newBalance: foundUser.balance };
}

};

    module.exports = walletService;