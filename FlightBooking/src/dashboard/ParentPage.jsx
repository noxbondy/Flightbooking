import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ParentContext } from '../context/ParentContext';
import '../Styles/Deshboard.css';

const ParentPage = () => {
  const [message, setMessage] = useState("Hello from Parent");

  const handleChildMessage = (msg) => {
    alert("Message from child: " + msg);
  };

  return (
    <ParentContext.Provider value={{ parentMessage: message, sendToParent: handleChildMessage }}>
      <div className="topnav">
        <i className="fa-solid fa-calendar-days logo"></i>
        <nav>
          <Link to="/">Home</Link>
          <Link to="#">About</Link>
          <Link to="/dashboard" className="active">Calendar</Link>
        </nav>
      </div>
      <div className="layout-container">
        <aside className="sidebar">
          <Link to="/dashboard" className="menu-item">
            <i className="fa-solid fa-table-columns"></i> Dashboard
          </Link>
          <Link to="child" className="menu-item">
  <i className="fa-solid fa-child"></i> Child Page
</Link>

<Link to="AllFlights" className="menu-item">
  <i className="fa-solid fa-plane"></i> All Flights
</Link>

<Link to="AvailableFlights" className="menu-item">
  <i className="fa-solid fa-plane"></i> AvailableFlights
</Link>

<Link to="BookedFlights" className="menu-item">
  <i className="fa-solid fa-plane"></i> BookedFlights
</Link>

<Link to="CreateFlight" className="menu-item">
  <i className="fa-solid fa-plane"></i> CreateFlight
</Link>

<Link to="FlightSearch" className="menu-item">
  <i className="fa-solid fa-plane"></i> FlightSearch
</Link>



        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </ParentContext.Provider>
  );
};

export default ParentPage;
