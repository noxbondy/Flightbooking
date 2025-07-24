import React, { useContext, useEffect, useState } from 'react';
import { ParentContext } from '../context/ParentContext';
import axios from 'axios';
import '../Styles/AllFlights.css';

const AllFlights = () => {
  const { parentMessage, sendToParent } = useContext(ParentContext);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiEndpoint = 'http://localhost:8080/api/flights';

  useEffect(() => {
    fetchAllFlights();
  }, []);

  const fetchAllFlights = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      if (response.status === 200) {
        setFlights(response.data);
      } else {
        setError("Failed to load flights");
      }
    } catch (error) {
      setError("Unable to fetch flights from the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Flight Bookings</h2>

      {loading && <p>Loading flights...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Flight Number</th>
                <th>Departure Airport</th>
                <th>Destination Airport</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Status</th>
                <th>Price (SEK)</th>
                <th>Passenger Name</th>
                <th>Passenger Email</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">No flights available</td>
                </tr>
              ) : (
                flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.id}</td>
                    <td>{flight.flightNumber}</td>
                    <td>{flight.departureAirport}</td>
                    <td>{flight.destinationAirport}</td>
                    <td>{new Date(flight.departureTime).toLocaleString()}</td>
                    <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                    <td>{flight.status}</td>
                    <td>{flight.price?.toFixed(2) ?? '0.00'}</td>
                    <td>{flight.passengerName || 'N/A'}</td>
                    <td>{flight.passengerEmail || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllFlights;
