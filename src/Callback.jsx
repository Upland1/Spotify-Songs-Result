import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getToken } from './getToken';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGetToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        console.error('No hay código de autorización en la URL');
        // Opcional: redirigir a login o mostrar mensaje
        return;
      }

      try {
        await getToken();
        console.log('Token obtenido');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error al obtener el token:', err);
        // Opcional: mostrar error al usuario o redirigir
      }
    };

    handleGetToken();
  }, [navigate]);

  return <div>Redirigiendo al dashboard...</div>;
};

export default Callback;