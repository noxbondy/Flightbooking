import { useEffect, useState } from "react";
import "../Styles/AvailableFlights.css";
import { MdOutlineFlightTakeoff } from "react-icons/md";
const AvailableFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);

  const apiEndpoint = "http://localhost:8080/api/flights";

  useEffect(() => {
    fetchAvailableFlights();
  }, []);

  const fetchAvailableFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}/available`);
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error("Error fetching available flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = async (flight) => {
    if (!name || !email) {
      alert("Please enter both name and email before booking.");
      return;
    }

    const bookingRequest = {
      passengerName: name,
      passengerEmail: email,
    };

    try {
      const response = await fetch(`${apiEndpoint}/${flight.id}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingRequest),
      });

      if (response.ok) {
        const result = await response.json();
        setBookingStatus(`Successfully booked flight ${result.flightNumber}`);
        fetchAvailableFlights(); // Refresh list
      } else {
        setBookingStatus("Failed to book the flight.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingStatus("Booking failed due to network or server error.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="available">Available Flights</h2>

      {/* Booking Info */}

      <div className="form-group flex flex-col space-y-4">
        <label>
          <input
            className="input is-large"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <input
            className="input is-large"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      {/* Status */}
      {bookingStatus && <div className="alert alert-info">{bookingStatus}</div>}

      {/* Flights Table */}
      {loading ? (
        <p>Loading...</p>
      ) : flights.length === 0 ? (
        <p>No available flights found.</p>
      ) : (
        <div className="table-responsive">
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
                <th>Passenger</th>
                <th>Book</th>
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
                  <td>{flight.passengerName || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSelectFlight(flight)}
                    >
                      <MdOutlineFlightTakeoff />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AvailableFlights;
