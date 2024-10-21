const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Seend the stringified books array as the response
  res.send(JSON.stringify(books));    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Send the filtered array as the response to the client
  res.send(JSON.stringify(books[isbn]));  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author;  
  let filtered_books = Object.values(books).filter(book => book.author == author);   
  // Send the filtered array as the response to the client
  res.send(JSON.stringify(filtered_books));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Retrieve the title from the request parameters
  const title = req.params.title;  
  let filtered_books = Object.values(books).filter(book => book.title == title);   
  // Send the filtered array as the response to the client
  res.send(JSON.stringify(filtered_books));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Send the filtered array as the response to the client
  res.send(JSON.stringify(books[isbn].reviews));  
});

module.exports.general = public_users;
