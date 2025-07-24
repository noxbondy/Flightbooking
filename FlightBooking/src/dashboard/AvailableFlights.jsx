
import { useEffect, useState } from 'react';
import { ParentContext } from '../context/ParentContext';

 const AvailableFlights = () => {

const[flights,setFlights]=useState([AvailableFlights]);
const [loading,setLoading]=useState(true);
const [name, setName] = useState("");
  const [email, setEmail] = useState("");

const apiEndpoint = 'http://localhost:8080/api/flights'; // Adjust this to your backend

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

  return (
    <div className='container mt-4'>
<div className="available-flights">
      <h2>Available Flights</h2>
      {flights.length === 0 ? (
        <p>No available flights found.</p>
      ) : (
        <div className='table-responsive'>
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
                  <td>{flight.price?.toFixed(2) ?? '0.00'}</td>
                  <td>{flight.passengerName || 'N/A'}</td>
                  <button
                className="button is-small is-primary"
                style={{ marginTop: 8 }}
                onClick={() => handleSelectFlight(flight)}
              >
                Book This Flight
              </button>
                </tr>
              ))}
            </tbody>
            
          </table>
        </div>
        
      )}
    </div>
    </div>
     
  )
}
export default AvailableFlights;
