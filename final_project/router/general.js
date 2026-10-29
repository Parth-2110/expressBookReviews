const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Internal data endpoint used by Axios
public_users.get('/internal/books', (req, res) => {
  return res.status(200).json(books);
});

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Task 10: Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/internal/books'
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Task 11: Get book details by ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/internal/books'
    );

    const isbn = req.params.isbn;
    const book = response.data[isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve book"
    });
  }
});

// Task 12: Get books by author using Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/internal/books'
    );

    const author = req.params.author.toLowerCase();

    const matchingBooks = Object.values(response.data).filter(
      book => book.author &&
        book.author.toLowerCase() === author
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books by author"
    });
  }
});

// Task 13: Get books by title using Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/internal/books'
    );

    const title = req.params.title.toLowerCase();

    const matchingBooks = Object.values(response.data).filter(
      book => book.title &&
        book.title.toLowerCase() === title
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books by title"
    });
  }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews || {});
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

module.exports.general = public_users;