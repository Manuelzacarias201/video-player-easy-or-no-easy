const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Array para almacenar usuarios
let users = [];

// Endpoint para registrar un nuevo usuario
app.post('/v1/users', (req, res) => {
  const { email, password_hash, full_name } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  // Crear un nuevo usuario
  const newUser = {
    id: users.length + 1,
    email,
    password_hash,
    full_name,
  };

  users.push(newUser);
  res.status(201).json({ message: 'Usuario registrado exitosamente', data: newUser });
});

// Endpoint para iniciar sesión
app.post('/v1/users/login', (req, res) => {
  const { email, password_hash } = req.body;

  const user = users.find(user => user.email === email && user.password_hash === password_hash);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  // Simular un token de autenticación
  const token = `Bearer token-for-user-${user.id}`;
  res.set('Authorization', token);
  res.json({ message: 'Inicio de sesión exitoso', data: user });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
