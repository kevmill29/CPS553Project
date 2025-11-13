const express = require('express');
const app  = express();
const db = require('./config/db')
const port = process.env.PORT || 3000 // or any port that you choose later

app.use("/controllers/", )
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//define api routes here


app.listen(PORT, ()=>{
    console.log(`Server port is running on ${PORT}`);
})