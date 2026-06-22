const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const protect = require('../middleware/auth');
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
});


router.post('/login', async (req,res) => {
    try {
        const {email, password} = req.body;
    

    if (!email || !password){
            return res.status(400).json({ error : 'Email and Password are required'});
        }

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({ error : 'User Not found'});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({ error: 'Invalid credentials' });
    }


    const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );


    res.json({
        message: 'Login Successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            balance: user.balance
        }
    });

    } catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get('/me' ,protect, async(req,res) => {
    try{
        const user = await User.findById(req.user.userId).select('-password');

        if(!user){
            return res.status(404).json({error:'User not found'});
        }

        res.json({user});
    } catch(err){
        res.status(500).json({error: err.message});
    }

});

module.exports = router;
