// SolicitudForm.js
import React, { useState, useEffect } from 'react';
import './SolicitudForm.css';
import axios from 'axios';
const SolicitudForm = (token) => {
  console.log(token)
  const [solicitudes, setSolicitudes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [comics, setComics] = useState([]);
  const [selectedComic, setSelectedComic] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


 useEffect(() => {
    cargarSolicitudes();
    cargarComics();
  }, []);

  const cargarSolicitudes = async (token) => {
    try {
      const response = await axios.get('https://dbpbackdeployment-production.up.railway.app/Solicitud/ver_Solicitud', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        setSolicitudes(response.data);
        setLoading(false);
      } else {
        setError('Error al cargar las solicitudes');
        setLoading(false);
      }
    } catch (error) {
      setError('Error en la solicitud: ' + error.message);
      setLoading(false);
    }
  };
  
  const cargarComics = async (token) => {
    try {
      const response = await axios.get('https://dbpbackdeployment-production.up.railway.app/comics', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const nombresComics = response.data.map((comic) => comic.nombre);
        setComics(nombresComics);
      } else {
        console.error('Error al cargar los cómics');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const comicSeleccionado = comics.find((comic) => comic === selectedComic);
    
    const solicitudData = {
      nombre:'',
      Ocupacion:'',
      fecha:'',
      //comic: { nombre: comicSeleccionado },
      comics:[],
      descripcion:'',
    };

    try {
      const response = await axios.post('https://dbpbackdeployment-production.up.railway.app/Solicitud', solicitudData, {
  headers: {
    Authorization: `Bearer ${token}`
  },
});


      if (response.ok) {
        console.log('Solicitud enviada exitosamente');
        cargarSolicitudes();
      } else {
        console.error('Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

    setNombre('');
    setPuesto('');
    setSelectedComic('');
    setDescripcion('');
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="solicitud-form">
        <h2>Formulario de Solicitud</h2>
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Puesto:</label>
          <input type="text" value={puesto} onChange={(e) => setPuesto(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Comic:</label>
          <select value={selectedComic} onChange={(e) => setSelectedComic(e.target.value)}>
            <option value="" disabled>Selecciona un cómic</option>
            {comics.map((comic) => (
              <option key={comic.id} value={comic.nombre}>{comic.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>

        <div className="form-group">
          <button type="submit">Enviar Solicitud</button>
        </div>
      </form>

      <div>
        <h2>Listado de Solicitudes</h2>
        {loading && <p>Cargando solicitudes...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && solicitudes.length === 0 && <p>No hay solicitudes existentes.</p>}
        {!loading && !error && solicitudes.length > 0 && (
          <ul className="solicitud-list">
            {solicitudes.map((solicitud) => (
              <li key={solicitud.id} className="solicitud-item">
                <div>
                  <strong>Nombre:</strong> {solicitud.nombre}
                </div>
                <div>
                  <strong>Puesto:</strong> {solicitud.puesto}
                </div>
                <div>
                  <strong>Descripción:</strong> {solicitud.descripcion}
                </div>
                <div>
                  <strong>Comic:</strong> {solicitud.comic.nombre}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SolicitudForm;
