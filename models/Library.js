const mysql = require("mysql2");
const dbConfig = require("../config/mysql.config.js");

class Library {
  constructor() {
    // En el constructor, creamos una conexión a la base de datos
    // y la guardamos en la propiedad connection de la clase

    // 1.Declaramos la conexión
    let connection = mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB
    });

    // 2.Abrimos la conexión
    connection.connect(error => {
      if (error) throw error;
      console.log("Successfully connected to the database.");
    });

    // 3.Dejamos la conexión en la propiedad connection, promisificada
    // (para poder utilizarlas más cómodamente en el resto de métodos de la clase)
    this.connection = connection.promise();
  }

  close = () => {
    this.connection.end();
  };

  // Métodos de la clase Library
  listAll = async () => {
    console.log(this.connection);
    const [results, fields] = await this.connection.query("SELECT * FROM books");
    return results;
  };

  create = async (newBook) => {
    try {
      const [results, fields] = await this.connection.query("INSERT INTO books SET ?", newBook);
      return results.affectedRows;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  update = async (id, updatedBook) => {
    try {
      const [results] = await this.connection.query(
        "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?",
        [updatedBook.title, updatedBook.author, updatedBook.year, id]
      );
      return results.affectedRows > 0; // Retorna true si se actualizó al menos una fila
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  delete = async (id) => {
    try {
      const [results] = await this.connection.query("DELETE FROM books WHERE id = ?", [id]);
      return results.affectedRows > 0; // Retorna true si se eliminó al menos una fila
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

module.exports = Library;
