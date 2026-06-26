const express = require ('express');
const app = express();
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

connectDB();
app.use(express.json());


const generalLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: {error: 'Too many requests, please try again later'}

});

const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 10,
    message: {error: 'Too many login attempts, please try again later'}
    
});

app.use(generalLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/wallet', require('./routes/wallet')); 
app.use('/api/reports', require('./routes/reports'));

app.get('/health',(req,res) =>{
    res.json({status : 'OK',message : 'Fintech API is running'});
});

app.get('/ping',(req,res) =>{
    res.json({pong  : true, timestamp : Date.now()});
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);

