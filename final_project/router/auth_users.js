const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}


const authenticatedUser = (username, password) => { //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Login endpoint
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password, username: username
      }, 'access', { expiresIn: 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;  

  const review = req.body.review;

  const username = req.session.authorization.username;  
  
  if (review) {
    if (!books[isbn]) {
      return res.status(300).json({ message: "Book not found" });
    }

    console.log(username);    
    books[isbn].reviews[username] = review;
    console.log(books[isbn].reviews[username]);
    return res.status(200).send(`Successfully added/updated review for ${isbn} by ${username}`);


  } else {
    return res.status(300).json({ message: "Invalid review" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;  
  const username = req.session.authorization.username;  
  if(!books[isbn]){
    return res.status(300).json({ message: `Book with ISBN ${isbn} not found` });}

  if(!books[isbn].reviews[username]){
    return res.status(300).json({ message: `Review by username ${username} not found` });}

  delete books[isbn].reviews[username];
  return res.status(200).send(`Successfully deleted review for ${isbn} by ${username}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
