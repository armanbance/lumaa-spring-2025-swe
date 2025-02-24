import React, { useState } from "react";
import { registerUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering with:", { username, password });

    try {
      const response = await registerUser(username, password);
      setNotification("User registered successfully! Redirecting to login...");
      console.log("User registered successfully:", response);
      setTimeout(() => {
        setNotification("");
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setNotification("Registration failed. Please try again.");
      setTimeout(() => {
        setNotification("");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96">
        <h2 className="text-3xl text-black font-bold mb-6 text-center">
          Register
        </h2>
        {notification && (
          <div className="text-green-500 text-center mb-4">{notification}</div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-black font-medium">Username:</label>
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
