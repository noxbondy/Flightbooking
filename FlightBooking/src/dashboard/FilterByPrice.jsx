import React, { useState } from "react";
import { ParentContext } from "../context/ParentContext";
const FilterByPrice = () => {
  const [maxPrice, setMaxPrice] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchFlights = async () => {
    if (!maxPrice || isNaN(maxPrice)) {
      setError("Please enter a valid number for max price");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/flights/filter-by-price?maxPrice=${maxPrice}`
      );
      if (!response.ok) throw new Error("Failed to fetch flights");

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError("Error fetching flights: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-4">
      <h2>Find Flights By Max Price</h2>

      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Enter max price (SEK)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleFetchFlights}>
          Search Flights
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {flights.length > 0 && (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Flight Number</th>
                <th>Departure</th>
                <th>Destination</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Status</th>
                <th>Price (SEK)</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.departureAirport}</td>
                  <td>{flight.destinationAirport}</td>
                  <td>{new Date(flight.departureTime).toLocaleString()}</td>
                  <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                  <td>{flight.status}</td>
                  <td>{flight.price?.toFixed(2) ?? "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {flights.length === 0 && !loading && !error && (
        <p>No flights found for the entered price.</p>
      )}
    </div>
  );
};

export default FilterByPrice;
