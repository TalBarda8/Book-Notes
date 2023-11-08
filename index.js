import express from "express";
import axios from "axios";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); 

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

let counter = 3;

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

app.get('/add-book', (req, res) => {
    res.render('add-book.ejs');
});

app.post('/submit-book', (req, res) => {
    const newBook = {
        id: ++counter,
        title: req.body.title,
        author: req.body.author,
        notes: req.body.notes,
        rating: req.body.rating,
        read_date: new Date(req.body.read_date),
        isbn: req.body.isbn,
    }

    books.push(newBook);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    const bookToEdit = books.find(book => book.id === bookId);
    if (bookToEdit) {
        res.render('edit-book.ejs', { book: bookToEdit });
    } else {
        res.status(404).send('Book not found');
    }
});

app.post('/edit/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex > -1) {
        books[bookIndex] = {
            ...books[bookIndex],
            title: req.body.title,
            author: req.body.author,
            notes: req.body.notes,
            rating: req.body.rating,
            read_date: new Date(req.body.read_date),
            isbn: req.body.isbn,
        };
        res.redirect('/');
    } else {
        res.status(404).send('Book not found');
    }
});

app.post('/delete/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    books = books.filter(book => book.id !== bookId);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})