import "./App.css";
import { useEffect } from "react";
import { getToken } from "./getToken";
import { getDataAuth, authFlow } from "./setup";
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate()
  const handleSetup = async() => {
    const code = await getDataAuth();
    authFlow(code);
    console.log(code)
  };

  const getUsers = async() => {
    const url = "http://localhost:3000/api/users";
    const res = await spotifyAPI(url, 'GET', null);
    console.log(res);
 }

  useEffect(() => {
    getUsers()
  }, []);
  
  const handleGetToken = () => {
    getToken();
    navigate('/dashboard')
  };

  return (
    <>
      <h1>Spotify Forms</h1>
      <button onClick={handleSetup}>START SETUP</button>
      <button onClick={handleGetToken}>GET TOKEN</button>
    </>
  );
}

export default App;
