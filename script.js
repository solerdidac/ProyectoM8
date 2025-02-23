const API_URL = 'https://mi-backend.herokuapp.com/api';

const loginFormElement = document.getElementById('login-form-element');
const loginMessage = document.getElementById('login-message');
const logoutButton = document.getElementById('logoutButton');
const booksSection = document.getElementById('books-section');
const bookForm = document.getElementById('book-form');
const createButton = document.getElementById('createButton');
const bookTable = document.getElementById('book-table');

function saveToken(token) {
    localStorage.setItem("jwtToken", token);
}

function getToken() {
    return localStorage.getItem("jwtToken");
}

function logout() {
    localStorage.removeItem("jwtToken");
    updateUI();
}

function updateUI() {
    const token = getToken();
    if (token) {
        loginFormElement.style.display = "none";
        logoutButton.style.display = "block";
        booksSection.style.display = "block";
        bookForm.style.display = "block";
    } else {
        loginFormElement.style.display = "block";
        logoutButton.style.display = "none";
        booksSection.style.display = "block";
        bookForm.style.display = "none";
    }
    fetchBooks();
}

// Manejo del login
loginFormElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            saveToken(data.token);  // Guardamos el token JWT
            loginMessage.textContent = "Inicio de sesión exitoso";
            loginMessage.style.color = "green";
            updateUI();
        } else {
            loginMessage.textContent = data.error;
            loginMessage.style.color = "red";
        }
    } catch (error) {
        loginMessage.textContent = "Error de conexión";
        loginMessage.style.color = "red";
    }
});

// Logout
logoutButton.addEventListener("click", logout);

// Cargar libros desde la API
async function fetchBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error al cargar los libros:', error);
    }
}

// Renderizar los libros
function renderBooks(books) {
    bookTable.innerHTML = books
        .map(
            (book) => `
            <tr>
                <td>${book.id}</td>
                <td contenteditable="true" id="title-${book.id}">${book.title}</td>
                <td contenteditable="true" id="author-${book.id}">${book.author}</td>
                <td contenteditable="true" id="year-${book.id}">${book.year}</td>
                <td>
                    ${getToken() ? `
                        <button onclick="updateBook('${book.id}')">Modificar</button>
                        <button onclick="deleteBook('${book.id}')">Eliminar</button>
                    ` : ''}
                </td>
            </tr>
        `
        )
        .join('');
}

// Modificar un libro
async function updateBook(id) {
    const token = getToken();
    if (!token) {
        alert("Debes iniciar sesión para modificar un libro.");
        return;
    }

    const title = document.getElementById(`title-${id}`).innerText;
    const author = document.getElementById(`author-${id}`).innerText;
    const year = document.getElementById(`year-${id}`).innerText;

    try {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, author, year }),
        });

        if (response.ok) {
            alert("Libro modificado correctamente");
            fetchBooks(); 
        } else {
            const data = await response.json();
            alert("Error: " + (data.error || "No se pudo modificar el libro"));
        }
    } catch (error) {
        alert("Error de conexión");
    }
}

// Añadir un libro
createButton.addEventListener("click", async () => {
    const token = getToken();
    if (!token) {
        alert("Debes iniciar sesión para añadir un libro.");
        return;
    }

    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const year = document.getElementById("book-year").value;

    try {
        const response = await fetch(`${API_URL}/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, author, year }),
        });

        if (response.ok) {
            // Libro creado, recargamos la lista
            document.getElementById("book-title").value = "";
            document.getElementById("book-author").value = "";
            document.getElementById("book-year").value = "";
            fetchBooks();
        } else {
            const data = await response.json();
            alert("Error: " + (data.error || "No se pudo crear el libro"));
        }
    } catch (error) {
        alert("Error de conexión al añadir libro");
    }
});

// Eliminar un libro
async function deleteBook(id) {
    const token = getToken();
    if (!token) {
        alert("No tienes permisos para eliminar libros.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.ok) {
            fetchBooks();
        } else {
            const data = await response.json();
            alert("Error: " + (data.error || "No se pudo eliminar el libro"));
        }
    } catch (error) {
        alert("Error de conexión al eliminar libro");
    }
}

updateUI();
