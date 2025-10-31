// src/js/api.js
async function crearUsuario(nombre, email, telefono) {
  const response = await fetch('http://localhost:8000/api/usuarios/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, telefono })
  });
  return await response.json();
}
