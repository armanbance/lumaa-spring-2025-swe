import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { username, password });
    try {
      const response = await loginUser(username, password);
      localStorage.setItem("token", response.token);
      navigate("/tasks"); // Redirect to tasks page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96">
        <h2 className="text-3xl text-black font-bold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Username:</label>
            <input
              type="text"
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
              style={{ backgroundColor: "white", color: "black" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password:</label>
            <input
              type="password"
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
              style={{ backgroundColor: "white", color: "black" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
