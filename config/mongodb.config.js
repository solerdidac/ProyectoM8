const { MongoClient } = require('mongodb');

// URL de conexión a MongoDB
const uri = "mongodb+srv://user:1234@cluster0.jyfuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectToMongoDB() {
    try {
        if (!bookCollection) {
            await client.connect();
            const db = client.db('book');
            bookCollection = db.collection('book');
            console.log('Conexion exitosa a MongoDB');
        }
        return bookCollection;
    } catch (error) {
        console.error('Error conectando:', error.message);
        process.exit(1);
    }
}


module.exports = connectToMongoDB;
