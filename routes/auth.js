const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

router.post('/register' , async (req,res)=>{
    try {
        const {name, email, password } = req.body;

        if (!name ||  !email || !password){
            return res.status(400).json({ error : 'All Field are required'});
        }

        if (password.length<6){
            return res.status(400).json({ error : 'Password must be atleast 6 characters'});
        }
        
        if (!email.includes('@')){
            return res.status(400).json({ error : 'Invalid email format'});
        }

        const exists = await User.findOne({email});

        if(exists){
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashed = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        res.status(201).json({
            message: 'User  registered successfully',
            userId: user._id,
            name: user.name
        });

    }

    catch(err) {
        res.status(500).json({
            error: err.message
        });
    }
})

module.exports = router;
