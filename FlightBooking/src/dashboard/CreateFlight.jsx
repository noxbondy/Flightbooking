import React, { useState } from 'react';
import '../Styles/CreateFlight.css';

const CreateFlight = () => {
  const [formData, setFormData] = useState({

    flightNumber: '',
    departureAirport: '',
    destinationAirport: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    status: 'AVAILABLE', // assuming enum values: AVAILABLE or BOOKED
  });

  const [createdFlights, setCreatedFlights] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/flights/createFlight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create flight');
      }

      const data = await response.json();
      setCreatedFlights(data);
      setMessage('Flight created successfully!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error creating flight.');
    }
  };

  return (
    <div className='container mt-4'>
      <h2>Create New Flight</h2>
      <form onSubmit={handleSubmit}>
        <input name="flightNumber" type="text" placeholder="Flight Number" onChange={handleChange} required />
        <input name="departureAirport" type="text" placeholder="Departure Airport" onChange={handleChange} required />
        <input name="destinationAirport" type="text" placeholder="Destination Airport" onChange={handleChange} required />
        <input name="departureTime" type="datetime-local" onChange={handleChange} required />
        <input name="arrivalTime" type="datetime-local" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <select name="status" onChange={handleChange}>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="BOOKED">BOOKED</option>
        </select>
        <button type="submit">Create Flight</button>
      </form>

      {message && <p>{message}</p>}

      {createdFlights.length > 0 && (
        <div>
          <h3>Created Flights</h3>
          <ul>
            {createdFlights.map((flight, index) => (
              <li key={index}>
                {flight.flightNumber} from {flight.departureAirport} to {flight.destinationAirport}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateFlight;