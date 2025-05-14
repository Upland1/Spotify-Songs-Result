import React from "react";
import { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    const newForm = {
      ...form,
      [name]: value,
    };

    setForm(newForm);
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
                <h1>
                    Hola
                </h1>
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
              First Name:
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                value={form.firstName}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                value={form.lastName}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={form.email}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={form.password}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
