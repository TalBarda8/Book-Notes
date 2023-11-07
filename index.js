import express from "express";
import axios from "axios";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.PG_USER,
    host: "localhost",
    database: "permalist",
    password: process.env.PG_PASSWORD,
    port: 5432,
});
db.connect();

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})