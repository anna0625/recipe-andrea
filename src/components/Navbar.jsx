import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaCookie, FaRegUser } from "react-icons/fa";
import React from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <FaSearch
              fill={pathMatchRoute("/") ? "#f5cac3" : "#f7ede2"}
              width="20px"
              height="20px"
            />
            <p
              className={
                pathMatchRoute("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offers")}>
            <FaCookie
              fill={pathMatchRoute("/offers") ? "#f5cac3" : "#f7ede2"}
              width="20px"
              height="20px"
            />
            <p
              className={
                pathMatchRoute("/offers")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Restaurants
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <FaRegUser
              fill={pathMatchRoute("/profile") ? "#f5cac3" : "#f7ede2"}
              width="20px"
              height="20px"
            />
            <p
              className={
                pathMatchRoute("/profile")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
