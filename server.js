const express = require ('express');
const app = express();
const connectDB = require('./config/db');

connectDB();


app.use(express.json());

app.get('/health',(req,res) =>{
    res.json({status : 'OK',messsage : 'Fintech API is running'});
});

app.get('/ping',(req,res) =>{
    res.json({pong  : true, timestamp : Date.now()});
});

app.listen(3000,()=>
    console.log('Server running on port 3000')
);

