import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/AllFlights.css";

const AllFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const apiEndpoint = "http://localhost:8080/api/flights";

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

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleInputChange = (flightId, e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [flightId]: {
        ...prev[flightId],
        [name]: value,
      },
    }));
  };

  const handleEdit = () => {
    const selectedData = {};
    flights.forEach((flight) => {
      if (selectedIds.includes(flight.id)) {
        selectedData[flight.id] = { ...flight };
      }
    });
    setEditData(selectedData);
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const updatePromises = selectedIds.map((id) =>
        axios.put(`${apiEndpoint}/${id}`, editData[id])
      );
      await Promise.all(updatePromises);
      setEditMode(false);
      setSelectedIds([]);
      fetchAllFlights();
    } catch (error) {
      console.error("Error updating booked flights:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="container mt-4">
          <h2 className="mb-4">All Flight Bookings</h2>

          <div className="mb-2">
            <button
              className="btn btn-primary me-2"
              onClick={handleEdit}
              disabled={selectedIds.length === 0}
            >
              Edit
            </button>
            <button
              className="btn btn-success"
              onClick={handleSave}
              disabled={!editMode}
            >
              Save Changes
            </button>
          </div>

          {loading && <p>Loading flights...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Select</th>
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
                      <td colSpan="11" className="text-center">
                        No flights available
                      </td>
                    </tr>
                  ) : (
                    flights.map((flight) => (
                      <tr key={flight.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(flight.id)}
                            onChange={() => handleCheckboxChange(flight.id)}
                          />
                        </td>
                        <td>{flight.id}</td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="text"
                              name="flightNumber"
                              value={editData[flight.id]?.flightNumber || ""}
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            flight.flightNumber
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="text"
                              name="departureAirport"
                              value={
                                editData[flight.id]?.departureAirport || ""
                              }
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            flight.departureAirport
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="text"
                              name="destinationAirport"
                              value={
                                editData[flight.id]?.destinationAirport || ""
                              }
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            flight.destinationAirport
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="datetime-local"
                              name="departureTime"
                              value={
                                editData[flight.id]?.departureTime
                                  ? new Date(
                                      editData[flight.id].departureTime
                                    )
                                      .toISOString()
                                      .slice(0, 16)
                                  : new Date(flight.departureTime)
                                      .toISOString()
                                      .slice(0, 16)
                              }
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            new Date(flight.departureTime).toLocaleString()
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="datetime-local"
                              name="arrivalTime"
                              value={
                                editData[flight.id]?.arrivalTime
                                  ? new Date(editData[flight.id].arrivalTime)
                                      .toISOString()
                                      .slice(0, 16)
                                  : new Date(flight.arrivalTime)
                                      .toISOString()
                                      .slice(0, 16)
                              }
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            new Date(flight.arrivalTime).toLocaleString()
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="text"
                              name="status"
                              value={editData[flight.id]?.status || ""}
                              onChange={(e) => handleInputChange(flight.id, e)}
                              placeholder="Enter status"
                            />
                          ) : (
                            flight.status ?? "N/A"
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="number"
                              name="price"
                              step="0.01"
                              value={editData[flight.id]?.price || ""}
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            flight.price?.toFixed(2) ?? "0.00"
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="text"
                              name="passengerName"
                              value={editData[flight.id]?.passengerName || ""}
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            flight.passengerName || "N/A"
                          )}
                        </td>

                        <td>
                          {editMode && selectedIds.includes(flight.id) ? (
                            <input
                              type="email"
                              name="passengerEmail"
                              value={editData[flight.id]?.passengerEmail || ""}
                              onChange={(e) => handleInputChange(flight.id, e)}
                            />
                          ) : (
                            flight.passengerEmail || "N/A"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFlights;