import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";
import SliderBanner from "./SliderBanner";
import { MdFlightTakeoff } from "react-icons/md";


const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">  <MdFlightTakeoff />FlightBook</div>
        
        <div className="nav-links">
          <Link to="/BookFlight">
            Book a flight
          </Link>
          <Link to="/YourFlights">YourFlights</Link>
          <Link to="/MyBooking">My Bookings</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <SliderBanner/>
      </nav>
    </div>
  );
};

export default Navbar;
