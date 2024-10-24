const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Helper function to get the book list, simulating an async operation
async function getBooks() {  
  return new Promise((resolve, reject) => {
      setTimeout(() => {          
        resolve(books);          
      }, 5000);
  });
}

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  try{
    //Retrieve the book list    
    const bookList = await getBooks();  
    // Send the stringified books array as the response
    res.send(JSON.stringify(bookList));    
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get the book list, simulating an async operation
async function getBooksByISBN(isbn) {  
  return new Promise((resolve, reject) => {
      setTimeout(() => {     
        if(isbn){
          if(books[isbn]){
            resolve(books[isbn]);
          }else{
            reject("ISBN not found");
          }
        }else{
          reject("ISBN not provided");
        }               
      }, 5000);
  });
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  try{
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    const book = await getBooksByISBN(isbn);
    // Send the filtered array as the response to the client
    res.send(JSON.stringify(book));    
  } 
  catch(error){
    res.status(403).json({ message: error.message });
  }
  
 });

 // Helper function to get the book list, simulating an async operation
async function getBooksByAuthor(author) {  
  return new Promise((resolve, reject) => {
      setTimeout(() => {     
        if(author){
          let filtered_books = Object.values(books).filter(book => book.author == author);
          if(filtered_books){
            resolve(filtered_books);
          }else{
            reject("Author not found");
          }
        }else{
          reject("Author not provided");
        }                       
      }, 5000);
  });
}
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  try{
    // Retrieve the author from the request parameters
    const author = req.params.author;
    let filtered_books = await getBooksByAuthor(author);
    // Send the filtered array as the response to the client
    res.send(JSON.stringify(filtered_books));
  }
  catch (error) {
    res.status(403).json({ message: error.message });
  }
});

// Helper function to get the book list, simulating an async operation
async function getBooksByTitle(title) {  
  return new Promise((resolve, reject) => {
      setTimeout(() => {     
        if(title){
          let filtered_books = Object.values(books).filter(book => book.title == title);
          if(filtered_books){
            resolve(filtered_books);
          }else{
            reject("Title not found");
          }
        }else{
          reject("Title not provided");
        }                       
      }, 5000);
  });
}

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  try{
    // Retrieve the title from the request parameters
    const title = req.params.title;  
    let filtered_books = await getBooksByTitle(title);
    // Send the filtered array as the response to the client
    res.send(JSON.stringify(filtered_books));
  }
  catch (error) {
    res.status(403).json({ message: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Send the filtered array as the response to the client
  res.send(JSON.stringify(books[isbn].reviews));  
});

module.exports.general = public_users;
