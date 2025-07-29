import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">✈️ FlightBook</div>
        <div className="nav-links">
          <Link to="/BookFlight" className="active">
            Book a flight
          </Link>
          <Link to="/YourFlights">YourFlights</Link>
          <Link to="/MyBooking">My Bookings</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </nav>
      <div className="banner">
  <img src="/banner.jpg" alt="Air Booking" />
  <div className="banner-text">Book Your Flight </div>
  <h2> aome text </h2>
</div>
    </div>
  );
};

export default Navbar;
