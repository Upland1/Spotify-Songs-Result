export const getToken = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const codeVerifier = localStorage.getItem('code_verifier');

  if (!code || !codeVerifier) {
    throw new Error('Faltan parámetros: code o code_verifier');
  }

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = 'http://127.0.0.1:3001/callback';

  const url = 'https://accounts.spotify.com/api/token';

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  const responseRaw = await fetch(url, payload);
  const response = await responseRaw.json();

  if (!responseRaw.ok) {
    throw new Error(`Error en token: ${JSON.stringify(response)}`);
  }

  localStorage.setItem('access_token', response.access_token);
  localStorage.removeItem('code_verifier'); // Limpia para que no se reutilice

  return response.access_token;
};
