import { useState } from "react";
import { spotifyAPI } from "./api/spotifyAPI";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistro = async () => {
    const url = 'http://localhost:3000/api/users';
    const data = JSON.stringify(form);
    console.log({ form });
    const res = await spotifyAPI(url, 'POST', data, null);
    console.log(res);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Lado izquierdo */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
          }}
        >
          <div>
            {/* Aquí puedes añadir un logo o ilustración */}
          </div>
        </div>

        {/* Lado derecho: formulario */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "60%",
              maxHeight: "500px",
              gap: "10px",
              width: "200px",
            }}
          >
            <label>
              Nombre:
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={form.name}
              />
            </label>
            <label>
              Correo:
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={form.email}
              />
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={form.password}
              />
            </label>
            <div>
              <button onClick={handleRegistro}>Registrar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
