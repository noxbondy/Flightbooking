import React from "react";
import "./App.css";
import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import BookFlight from "./pages/BookFlight";
import Footer from "./component/Footer";
import Dashboard from "./dashboard/Dashboard";
import YourFlights from "./pages/YourFlights";
import AllFlights from "./dashboard/AllFlights";
import AvailableFlights from "./dashboard/AvailableFlights";
import CreateFlight from "./dashboard/CreateFlight";
import BookedFlights from "./dashboard/BookedFlights";
import ParentPage from "./dashboard/ParentPage";
import MyBooking from "./pages/MyBooking";
import FlightSearch from "./dashboard/FlightSearch";
import FilterByPrice from "./dashboard/FilterByPrice";
import { ParentContext } from "./context/ParentContext";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/BookFlight" element={<BookFlight />} />
        <Route path="MyBooking" element={<MyBooking />} />
        <Route path="YourFlights" element={<YourFlights />} />

        {/* Nested routes under ParentPage */}
        <Route path="/" element={<ParentPage />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="AllFlights" element={<AllFlights />} />
          <Route path="AvailableFlights" element={<AvailableFlights />} />
          <Route path="BookedFlights" element={<BookedFlights />} />
          <Route path="CreateFlight" element={<CreateFlight />} />
          <Route path="FlightSearch" element={<FlightSearch />} />
          <Route path="FilterByPrice" element={<FilterByPrice />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
