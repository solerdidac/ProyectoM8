const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth");
const { getBooks, addBook, updateBook, deleteBookById } = require("../controllers/books");
const { verifyToken} = require("../middleware/auth");

router.post("/login", login);
router.get("/books", getBooks);
router.post("/books", verifyToken, addBook);
router.put("/books/:id", verifyToken, updateBook);
router.delete("/books/:id", verifyToken, deleteBookById);

module.exports = router;
