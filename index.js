require('dotenv').config();
const express = require('express');

const app = express();

const port = process.env.PORT || 4500;

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

const { query } = require("./models/db_connect");

app.get("/testdb", async (req, res) => {
    try {
        const rows = await query("SELECT 1");
        res.json({ ok: true, rows });
    } catch (err) {
        res.status(500).json({ ok: false, error: err });
    }
});


app.listen(port, () => {
    console.log(`Server port is running on ${port}`);
});
