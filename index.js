import express from "express";
import axios from "axios";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: process.env.PG_USER,
    host: "localhost",
    database: "BooksNotes",
    password: process.env.PG_PASSWORD,
    port: 5432,
});
db.connect();

app.get("/", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books');
        const books = result.rows;
        
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

app.post('/submit-book', async (req, res) => {
    const { title, author, notes, rating, read_date, isbn } = req.body;

    try {
        const coverResponse = await axios.get(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`, { responseType: 'stream' });
        const coverUrl = coverResponse.config.url;

        await db.query('INSERT INTO books (title, author, notes, rating, read_date, isbn, cover) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [title, author, notes, rating, read_date, isbn, coverUrl]
        );
        
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

app.get('/edit/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const bookToEdit = await db.query('SELECT * FROM books WHERE id = $1', [bookId]);
    
        if (bookToEdit.rows && bookToEdit.rows.length > 0) {
          const book = bookToEdit.rows[0];
    
          res.render('edit-book.ejs', { book: book });
        } else {
          res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.post('/edit/:id', async (req, res) => {
    const bookId = req.params.id;
    const { title, author, notes, rating, read_date, isbn } = req.body;

    try {
        await db.query(`UPDATE books SET title = $1, author = $2, notes = $3, rating = $4, read_date = $5, isbn = $6 WHERE id = $7`, [title, author, notes, rating, read_date, isbn, bookId]);

        res.redirect('/');
    } catch (error) {
        console.error('Error updating book', error.stack);
    }
});

app.post('/delete/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        await db.query(`DELETE FROM books WHERE id = $1`, [bookId]);

        res.redirect('/');
    } catch (error) {
        console.error('Error updating book', error.stack);
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})