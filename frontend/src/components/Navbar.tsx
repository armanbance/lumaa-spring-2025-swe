import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 500);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <div>
      <nav className="bg-white p-4 shadow-lg">
        <ul className="flex space-x-6 justify-center">
          <li>
            <Link
              to="/"
              className=" hover:text-blue-200 font-semibold transition duration-300"
            >
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 font-semibold transition duration-300 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className="hover:text-blue-200 font-semibold transition duration-300"
                >
                  Tasks
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/register"
                  className="hover:text-blue-200 font-semibold transition duration-300"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-200 font-semibold transition duration-300"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
