import React, { useState } from "react";
import { ParentContext } from "../context/ParentContext";
import "../Styles/FlightSearch.css";
import MyBooking from "../pages/MyBooking";
const FlightSearch = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [status, setStatus] = useState("BOOKED"); // Default status
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/flights/bookings/search/flightNumber?flightNumber=${flightNumber}&status=${status}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setBookings([]);
    }
  };
  return (
    <div className="container s justify-content-center">
      <h2 className="text-xl font-bold mb-4">
        Search Bookings by Flight Number & Status
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Flight Number"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          className="border p-2 mr-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="BOOKED">BOOKED</option>
          <option value="AVAILABLE">ABAILABLE</option>

          {/* Add other statuses as needed */}
        </select>
        <div className="search">
          <button
            onClick={handleSearch}
            className="button is-link is-outlined"
            type="submit"
          >
            Search{" "}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {bookings.length > 0 && (
        <table className="table-auto border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Booking ID</th>
              <th className="border px-4 py-2">Flight Number</th>
              <th className="border px-4 py-2">Departure Airport</th>
              <th className="border px-4 py-2">Destination Airport</th>
              <th className="border px-4 py-2">Departure Time</th>
              <th className="border px-4 py-2">Arrival Time</th>
              <th className="border px-4 py-2">Passenger</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border px-4 py-2">{booking.id}</td>
                <td className="border px-4 py-2">{booking.flightNumber}</td>
                <td className="border px-4 py-2">{booking.departureAirport}</td>
                <td className="border px-4 py-2">
                  {booking.destinationAirport}
                </td>
                <td className="border px-4 py-2">{booking.departureTime}</td>
                <td className="border px-4 py-2">{booking.arrivalTime}</td>
                <td className="border px-4 py-2">{booking.passengerName}</td>
                <td className="border px-4 py-2">{booking.passengerEmail}</td>
                <td className="border px-4 py-2">{booking.status}</td>
                <td className="border px-4 py-2">{booking.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mybooking ">
        <div className="col-md-12">
          <MyBooking />
        </div>
      </div>
    </div>
  );
};
export default FlightSearch;
