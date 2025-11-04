const express = require('express');
const app  = express();
const db = require('./db')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//define api routes here


const port = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server port is running on ${PORT}`);
})