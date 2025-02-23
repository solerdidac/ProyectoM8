// controllers/books.js
const { listAll, create, update, deleteBook, connectToMongoDB } = require('../models/mongodb');

async function getBooks(req, res) {
    try {
        const books = await listAll();
        const formattedBooks = books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            year: book.year
        }));
        console.log("Enviando libros al frontend:", formattedBooks);
        res.status(200).json(formattedBooks);
    } catch (error) {
        console.error("Error al obtener los libros:", error);
        res.status(500).json({ error: "Error al obtener los libros" });
    }
}

async function addBook(req, res) {
    console.log("Solicitud recibida en /api/books", req.body);

    const { title, author, year } = req.body;
    if (!title || !author || !year) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const db = await connectToMongoDB();
        const collection = db.collection('book');

        const totalBooks = await collection.countDocuments();
        const newId = totalBooks + 1;

        const newBook = { id: newId, title, author, year };
        await create(newBook);

        console.log("Libro creado exitosamente:", newBook);
        res.status(201).json({ message: "Libro creado exitosamente", id: newId });
    } catch (error) {
        console.error("❌ Error al crear el libro:", error);
        res.status(500).json({ error: "❌ Error en el servidor" });
    }
}

async function updateBook(req, res) {
    let { id } = req.params;
    const { title, author, year } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ error: 'ID no proporcionado' });
        }
        id = Number(id);

        const updatedBook = { title, author, year };
        const success = await update(id, updatedBook);

        if (success) {
            res.status(200).json({ message: 'Libro actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Libro no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        res.status(500).json({ error: 'Error interno al actualizar el libro' });
    }
}

async function deleteBookById(req, res) {
    const { id } = req.params;
    try {
        const success = await deleteBook(id);
        if (success) {
            res.status(200).json({ message: 'Libro eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Libro no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
}

module.exports = { getBooks, addBook, updateBook, deleteBookById };
