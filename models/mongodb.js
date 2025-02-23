// models/mongodb.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://user:1234@cluster0.jyfuu.mongodb.net/book?retryWrites=true&w=majority&tls=true";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
});

let db;

async function connectToMongoDB() {
    try {
        if (!db) {
            await client.connect();
            db = client.db('book');
            console.log('Conexión exitosa a MongoDB Atlas');
        }
        return db;
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
}

async function listAll() {
    try {
        const db = await connectToMongoDB();
        const books = await db.collection('book').find().toArray();

        return books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            year: book.year
        }));
    } catch (error) {
        console.error('Error en listAll:', error);
        return []; 
    }
}

async function create(newBook) {
    try {
        const db = await connectToMongoDB();
        const result = await db.collection('book').insertOne(newBook);
        return result.insertedId; 
    } catch (error) {
        console.error('Error al insertar el libro en MongoDB:', error);
        return null;
    }
}

async function update(id, updatedBook) {
    try {
        const db = await connectToMongoDB();
        id = Number(id);
        const result = await db.collection('book').updateOne(
            { id: id },
            { $set: updatedBook }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error en la actualización de MongoDB:', error);
        return false;
    }
}

async function deleteBook(id) {
    try {
        const db = await connectToMongoDB();
        const result = await db.collection('book').deleteOne({ id: Number(id) });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        return false;
    }
}

module.exports = { listAll, create, update, deleteBook, connectToMongoDB };
