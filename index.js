require("dotenv").config();
const express = require('express');
const cors = require("cors");
const { Pool } = require("pg");
const app = express()


const port = process.env.PORT || 3000;

//Middleware
app.use(express.json()); // parse json 
app.use(cors()); 

// Made a new datebase Connection 
const pool = new Pool({
    connectionString: process.env.DB_URL, // postgreSQL Connection
    ssl: {
        rejectUnauthorized: false, // idk what this means
    },
});

// check that "Emails" table exist
const creatTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXIST Emails (
               id SERIAL PRIMARY KEY, 
               email TEXT UNIQUE NOT NULL
            )
            `);
        console.log("DB is connect & table checked");
    }   catch (error) {
        console.error("Database error:", error);
    }
};
creatTable()

app.post("/add-email", async (req, res) =>  {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required"});
    }

    try{
        const result = await pool.query(
            "INSErT INTO emails (email) VALUES ($1) ON CONFLICT DO NOTHING RETURN ",
            [email]
        );

        if (result.rowCount == 0){
            return res.status(409).json({ message: "Email already exists"});
        }

        res.status(201).json({ message: "Email added sucessfully!"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

//Route me to retrieve emails

app.get("/emails", async(req, res) => {

    try{
        const result = await pool.query("SELECT email FROM emails");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




