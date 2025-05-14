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


  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get("code");
  //   if (code) {
  //     getToken();
  //   }
  // }, []);
  
  const handleGetToken = () => {
    getToken();
    navigate('/dashboard')
  };

  return (
    <>
      <h1>Hola mundo</h1>
      <button onClick={handleSetup}>START SETUP</button>
      <button onClick={handleGetToken}>GET TOKEN</button>
    </>
  );
}

export default App;
