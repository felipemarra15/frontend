// src/js/api.js
async function crearUsuario(nombre, mail, telefono) {
  const response = await fetch(`${window.API_BASE || 'http://localhost:8000'}/api/usuarios/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, mail, telefono }) 
  });
  return await response.json();
}
