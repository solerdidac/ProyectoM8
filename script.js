const API_URL = 'http://localhost:5000/api';

// Elementos del DOM
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const logoutButton = document.getElementById('logoutButton');
const booksSection = document.getElementById('books-section');
const createButton = document.getElementById('createButton');
const bookTable = document.getElementById('book-table');

// Guardar token en localStorage
function saveToken(token) {
  localStorage.setItem("jwtToken", token);
}

// Obtener token de localStorage
function getToken() {
  return localStorage.getItem("jwtToken");
}

// Eliminar token (logout)
function logout() {
  localStorage.removeItem("jwtToken");
  updateUI();
}

// Actualizar UI según autenticación
function updateUI() {
  const token = getToken();
  if (token) {
    loginForm.style.display = "none";
    logoutButton.style.display = "block";
    // Se muestra la tabla siempre
    createButton.style.display = "inline-block"; // Mostrar botón de añadir libro
  } else {
    loginForm.style.display = "block";
    logoutButton.style.display = "none";
    // La tabla se muestra aunque no esté logueado,
    // pero las funciones de acción validarán el token
    createButton.style.display = "inline-block"; 
  }
  fetchBooks(); // Cargar los libros siempre
}

// Manejo del login
loginForm.addEventListener("submit", async (event) => {
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
      saveToken(data.token);
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

// Renderizar los libros en la tabla (siempre se muestran los botones de acción)
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
          <button onclick="updateBook('${book.id}')">Modificar</button>
          <button onclick="deleteBook('${book.id}')">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join('');
}

// Función para modificar un libro (requiere token)
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
      alert("Error al modificar el libro");
    }
  } catch (error) {
    alert("Error de conexión");
  }
}

// Función para añadir un libro (requiere token)
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
      fetchBooks();
    } else {
      alert("Acceso no autorizado");
    }
  } catch (error) {
    alert("Error de conexión");
  }
});

// Función para eliminar un libro (requiere token)
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
      alert("Acceso no autorizado");
    }
  } catch (error) {
    alert("Error de conexión");
  }
}

// Inicializa la UI al cargar la página
updateUI();
