// js/listar.js
document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#tabla-usuarios tbody");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/usuarios/");
    if (!response.ok) throw new Error("Error al obtener usuarios");

    const usuarios = await response.json();

    // Si no hay usuarios, mostramos un mensaje
    if (usuarios.length === 0) {
      tableBody.innerHTML = `
        <tr><td colspan="4">No hay usuarios registrados.</td></tr>
      `;
      return;
    }

    // Renderizar filas
    tableBody.innerHTML = usuarios
      .map(
        (u) => `
        <tr>
          <td>${u.id}</td>
          <td>${u.nombre}</td>
          <td>${u.mail}</td>
          <td>${u.telefono}</td>
        </tr>`
      )
      .join("");
  } catch (error) {
    console.error("Error:", error);
    tableBody.innerHTML = `
      <tr><td colspan="4">Error al cargar usuarios</td></tr>
    `;
  }
});
