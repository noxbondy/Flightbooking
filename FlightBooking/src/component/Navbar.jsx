import React from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Navbar.css'

 const Navbar = () => {
  return (
    <div className="navbar">
         <div class="logo">✈️ FlightBook</div>
  <div class="nav-links">
      <a href="BookFlight" class="active">Book a flight</a>
      <a href="#">Check-in</a>
      <a href="MyBooking">My Bookings</a>
      
      
    
      <Link to="/dashboard">Dashboard</Link>
    </div>
    
 
  
  </div>
  )
}
export default Navbar;
