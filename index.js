const express = require('express');
const app  = express();
const db = require('./config/db')
const port = process.env.PORT || 3000 // or any port that you choose later

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//define api routes here
app.use('/auth', authRoute)
app.use('/users', userRoute)

app.listen(port, ()=>{
    console.log(`Server port is running on ${port}`);
})