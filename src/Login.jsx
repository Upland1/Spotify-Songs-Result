import { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({
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
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
        }}
      >
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
            type="text"
            name="password"
            onChange={handleChange}
            value={form.password}
          />
        </label>
      </div>
    </>
  );
};

export default Login;
