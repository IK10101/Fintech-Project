const User = require('../models/user')
const Transaction = require('../models/transaction');

const walletService = {
  async getBalance(userId) {
    const foundUser = await User.findById(userId).select('balance name');
    if (!foundUser) throw new Error('User not found');
    return foundUser;
  },

  async deposit(userId, amount, description = 'Deposit') {
    if (!amount || amount <= 0) throw new Error('Amount must be greater than 0');

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
    if (!amount || amount <= 0) throw new Error('Amount must be greater than 0');

    const foundUser = await User.findById(userId);
    if (!foundUser) throw new Error('User not found');

    if (foundUser.balance < amount) throw new Error('Insufficient funds');

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
  },

  async transfer(senderId, receiverEmail, amount, description = 'Transfer') {
    const mongoose = require('mongoose');

    if (!amount || amount <= 0) throw new Error('Amount must be greater than zero');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sender = await User.findById(senderId).session(session);
      const receiver = await User.findOne({ email: receiverEmail }).session(session);

      if (!receiver) throw new Error('Receiver not found');
      if (!sender) throw new Error('Sender not found');
      if (sender._id.toString() === receiver._id.toString()) throw new Error('Cannot transfer to yourself');
      if (sender.balance < amount) throw new Error('Insufficient funds');

      sender.balance -= Number(amount);
      receiver.balance += Number(amount);

      await sender.save({ session });
      await receiver.save({ session });

      await Transaction.create([
        {
          user: sender._id,
          type: 'debit',
          amount,
          description: `Transfer to ${receiverEmail}`,
          category: 'other',
          balanceAfter: sender.balance
        },
        {
          user: receiver._id,
          type: 'credit',
          amount,
          description: `Transfer from ${sender.email}`,
          category: 'other',
          balanceAfter: receiver.balance
        }
      ], { session, ordered: true });

      await session.commitTransaction();

      return {
        message: 'Transfer successful',
        senderBalance: sender.balance,
        transferredTo: receiverEmail,
        amount
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

};

    module.exports = walletService;