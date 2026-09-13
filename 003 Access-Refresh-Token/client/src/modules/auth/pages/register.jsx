import { useState } from "react";
import { useNavigate } from "react-router";

import useApi from "../../../shared/useApi.js";
import { useAuthContext } from "../context/AuthProvider.jsx";

const Register = () => {
  const api = useApi();
  const authContext = useAuthContext();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Register response:", response.data);

      authContext.setAccessToken(response.data.accessToken);
      authContext.setUser(response.data.data.user);
      navigate("/profile");
    } catch (err) {
      console.log("Register error:", err);

      setError(
        err?.response?.data?.message || err?.message || "Registration failed",
      );
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded-sm"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded-sm"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded-sm"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="border p-2 rounded-sm bg-blue-500" type="submit">
          Register
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">{String(error)}</p>}
    </div>
  );
};

export default Register;
