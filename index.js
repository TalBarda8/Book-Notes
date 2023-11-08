import express from "express";
import axios from "axios";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

// const db = new pg.Client({
//     user: process.env.PG_USER,
//     host: "localhost",
//     database: "BooksNotes",
//     password: process.env.PG_PASSWORD,
//     port: 5432,
// });
// db.connect();

let books = [
    { id: 1, title: "Harry Potter and the Deathly Hallows", author: "J.K. Rowling", notes: "Amazing book!", rating: 9, read_date: new Date("2014-08-19"), isbn: "9781408855713" },
    { id: 2, title: "Harry Potter and the Half-Blood Prince", author: "J.K. Rowling", notes: "Nice book", rating: 7, read_date: new Date("2017-07-06"), isbn: "9781408855706" },
    { id: 3, title: "Harry Potter and the Prisoner of Azkaban", author: "J.K. Rowling", notes: "Very interesting!", rating: 8, read_date: new Date("2020-01-21"), isbn: "9781408855676" }
];

app.get("/", async (req, res) => {
    try {
        for (const book of books) {
            const cover = await axios.get(`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`);
            book.cover = cover;
        }
        
        res.render("index.ejs", {
            booksList: books,
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})