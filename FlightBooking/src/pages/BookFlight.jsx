import React, { useState } from "react";
import "../Styles/BookFlihgt.css";

const BookFlight = () => {
  const [status, setStatus] = useState("AVAILABLE");
  const [departureAirport, setDepartureAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiEndpoint = "http://localhost:8080/api/flights/search";

  const searchFlights = async () => {
    if (!departureAirport || !destinationAirport) {
      setError("Please enter both departure and destination airports.");
      return;
    }

    setLoading(true);
    setError(null);
    setBookingMessage("");

    try {
      const params = new URLSearchParams();
      params.append("status", status);
      params.append("departureAirport", departureAirport.trim());
      params.append("destinationAirport", destinationAirport.trim());
      params.append("departureTime", departureTime.trim());
      params.append("arrivalTime", arrivalTime.trim());

      const response = await fetch(`${apiEndpoint}?${params.toString()}`);

      if (response.status === 204) {
        setFlights([]);
        setError("No flights found.");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch flights");
      }

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Error fetching flights: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setName("");
    setEmail("");
    setBookingMessage("");
  };

  const handleBooking = async () => {
    if (!name || !email) {
      setBookingMessage("Please enter your name and email.");
      return;
    }

    const bookingEndpoint = `http://localhost:8080/api/flights/${selectedFlight.id}/book`;

    try {
      const response = await fetch(bookingEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passengerName: name, passengerEmail: email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Booking failed. Try again.");
      }

      setBookingMessage("✅ Flight booked successfully!");
      setSelectedFlight(null);
    } catch (err) {
      setBookingMessage("❌ Booking failed: " + err.message);
    }
  };

  return (
    <div className="container justify-content-center">
      <div className="col-md-12">
        <div className="card">
          <div className="card-content">
            <h2>Search Available Flights</h2>

            <div style={{ marginBottom: 12 }}>
              <label>
                Status:{" "}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                </select>
              </label>
            </div>

            <div className="form-group flex flex-col space-y-4">
              <label>
                Departure Airport:{" "}
                <input
                  className="input is-large"
                  type="text"
                  value={departureAirport}
                  onChange={(e) => setDepartureAirport(e.target.value)}
                  placeholder="🛫 Departure Airport"
                />
              </label>

              <label>
                Destination Airport:{" "}
                <input
                  className="input is-large"
                  type="text"
                  value={destinationAirport}
                  onChange={(e) => setDestinationAirport(e.target.value)}
                  placeholder="🛬 Destination Airport"
                />
              </label>
            </div>

            <div className="search" style={{ marginTop: 16 }}>
              <button
                className="button is-medium is-responsive"
                onClick={searchFlights}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search Flights"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 16, fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {flights.length > 0 && (
        <ul style={{ marginTop: 20 }}>
          {flights.map((flight) => (
            <li key={flight.id} style={{ marginBottom: 20 }}>
              <strong>{flight.flightNumber}</strong> from{" "}
              {flight.departureAirport} to {flight.destinationAirport} — Status:{" "}
              {flight.status} — Departure: {flight.departureTime}— Arrival:{" "}
              {flight.arrivalTime} — Price: ${flight.price}
              <br />
              <button
                className="button is-small is-primary"
                style={{ marginTop: 8 }}
                onClick={() => handleSelectFlight(flight)}
              >
                Book This Flight
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedFlight && (
        <div
          className="card"
          style={{
            marginTop: 24,
            padding: 16,
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginBottom: 10 }}>
            Booking: {selectedFlight.flightNumber} from{" "}
            {selectedFlight.departureAirport} to{" "}
            {selectedFlight.destinationAirport}
          </h3>
          <label>
            Name:{" "}
            <input
              className="input is-medium"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </label>
          <br />
          <label>
            Email:{" "}
            <input
              className="input is-medium"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
            />
          </label>
          <br />
          <button
            className="button is-success is-medium"
            style={{ marginTop: 10 }}
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
          <button
            className="button is-light is-medium ml-4"
            onClick={() => setSelectedFlight(null)}
            style={{ marginTop: 10 }}
          >
            Cancel
          </button>

          {bookingMessage && (
            <p style={{ marginTop: 10, fontWeight: "bold", color: "blue" }}>
              {bookingMessage}
            </p>
          )}
        </div>
      )}

      {!loading && !error && flights.length === 0 && (
        <p style={{ marginTop: 20, fontStyle: "italic" }}>
          No flights found yet.
        </p>
      )}
    </div>
  );
};

export default BookFlight;
