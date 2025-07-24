import React, { useState } from 'react';
import axios from 'axios';
import "../Styles/MyBooking.css";

 const MyBooking = () => {
    const [flightNumber, setFlightNumber] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:8080/api/flights/findbooking', {
        params: {
          flightNumber,
          passengerEmail,
          
        },
      });

      setBooking(response.data);
      setError('');
    } catch (err) {
      setBooking(null);
      setError('Booking not found or invalid input.');
    }
  };

  return (
    <div className="container justify-content-center">
      <div className='col-md-12'>
        <div className='card'>
          <div className='card-content'>
<h2 className='Details'>Find Your Booking Details</h2>
      <form onSubmit={handleSearch} className="find-booking-form">
        <div className='form-group flex flex-col space-y-4'>
<label>
<input className='input is-large'
          type="text"
          placeholder="Flight Number"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          required
        />
</label>
<label>
  <input className='input is-large'
          type="email"
          placeholder="Passenger Email"
          value={passengerEmail}
          onChange={(e) => setPassengerEmail(e.target.value)}
          required
        />
</label>
        </div>
       <div className='search'>
<button className='button is-medium is-responsive' type="submit">Search</button>
        </div> 
        
        
        
      </form>

      {error && <p className="error">{error}</p>}

      {booking && (
        <div className="booking-result">
    <h3>Booking Details</h3>
    <p><strong>Flight Id:</strong> {booking.id}</p>
    <p><strong>Flight Number:</strong> {booking.flightNumber}</p>
    <p><strong>Departure Airport:</strong> {booking.departureAirport}</p>
    <p><strong>Destination Airport:</strong> {booking.destinationAirport}</p>
    <p><strong>Departure Time:</strong> {booking.departureTime}</p>
    <p><strong>Arrival Time:</strong> {booking.arrivalTime}</p>
    <p><strong>Passenger Name:</strong> {booking.passengerName}</p>
    <p><strong>Passenger Email:</strong> {booking.passengerEmail}</p>
    <p><strong>Status:</strong> {booking.status}</p>
  </div>
  )}
          </div>

        </div>
      </div>
      
      
    </div>
  )
}
export default MyBooking;
