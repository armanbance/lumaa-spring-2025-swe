import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
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
          <li>
            <Link
              to="/register"
              className=" hover:text-blue-200 font-semibold transition duration-300"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className=" hover:text-blue-200 font-semibold transition duration-300"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className="text-white hover:text-blue-200 font-semibold transition duration-300"
            >
              Tasks
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
