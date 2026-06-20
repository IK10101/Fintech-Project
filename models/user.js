const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type: String, required: true, trim: true},
    email : {type: String, required: true, trim: true, unique: true, lowercase : true},
    password : {type: String, required: true,},
    balance : {type: Number , default : 0},
    createdAt : {type: Date, default: Date.now},
    currency : {type: String, default: 'INR' },
    isActive : {type: Boolean, default: true}
});

module.exports = mongoose.model('User',userSchema);
