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
creatTable();

