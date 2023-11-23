// RegistroUsuario.js
import React, { useState } from 'react';

const RegistroUsuario = ({ onRegistroExitoso }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleRegistro = async (e) => {
    e.preventDefault();

    const usuarioData = {
      nombreUsuario,
      contrasena,
    };

    try {
      const response = await fetch('http://tu-backend.com/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      if (response.ok) {
        console.log('Usuario registrado exitosamente');
        onRegistroExitoso();
      } else {
        console.error('Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error en el registro de usuario:', error);
    }

    setNombreUsuario('');
    setContrasena('');
  };

  return (
    <form onSubmit={handleRegistro}>
      <label>
        Nombre de Usuario:
        <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
      </label>
      <label>
        Contraseña:
        <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
      </label>
      <button type="submit">Registrar Usuario</button>
    </form>
  );
};

export default RegistroUsuario;
