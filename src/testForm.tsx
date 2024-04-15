import React, { useEffect, useState } from 'react';

const Formulario = () => {

  // Manejo del envío del formulario

  const [datos, setDatos] = useState({ nombre: '', email: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatos({ ...datos, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.api.enviarDatosFormulario(datos);
  };

  // Manejar respuesta del backend

  const [respuesta, setRespuesta] = useState('');

  // Listener para recibir la respuesta del backend
  useEffect(() => {
    window.api.recibirRespuesta((mensaje) => {
      setRespuesta(mensaje);
    });
  }, []);



  return (
    <form onSubmit={handleSubmit}>
      {/* Mostrar la respuesta del backend */}
      {respuesta && <p>{respuesta}</p>}
      <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} placeholder="Nombre" />
      <input type="email" name="email" value={datos.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
