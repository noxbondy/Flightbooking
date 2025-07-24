import React from 'react';
import './App.css';
import Navbar from './component/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BookFlight from './pages/BookFlight';

import Dashboard from './dashboard/Dashboard';
import ChildPage from './dashboard/ChildPage';
import AllFlights from './dashboard/AllFlights';
import AvailableFlights from './dashboard/AvailableFlights';
import CreateFlight from './dashboard/CreateFlight';
import BookedFlights from './dashboard/BookedFlights';
import ParentPage from './dashboard/ParentPage';
import MyBooking from './pages/MyBooking';
import FlightSearch from './dashboard/FlightSearch';
import { ParentContext } from './context/ParentContext';


function App() {
 

  return (
   
     <BrowserRouter>
      <Navbar />
      <Routes>


        <Route path='/BookFlight' element={<BookFlight />} />
        <Route path="MyBooking" element={<MyBooking />} />

        {/* Nested routes under ParentPage */}
        <Route path="/" element={<ParentPage />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="child" element={<ChildPage />} />
          <Route path="AllFlights" element={<AllFlights />} />
          <Route path="AvailableFlights" element={<AvailableFlights />} />
          <Route path="BookedFlights" element={<BookedFlights />} />
          <Route path="CreateFlight" element={<CreateFlight />} />
          <Route path="FlightSearch" element={<FlightSearch />} />
          
          

        </Route>
      </Routes>
    </BrowserRouter>
  
  )
}

export default App
