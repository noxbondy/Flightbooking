package se.lexicon.flightbooking.service;

import jdk.jshell.Snippet;
import se.lexicon.flightbooking.dto.AvailableFlightDTO;
import se.lexicon.flightbooking.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking.dto.FlightBookingDTO;
import se.lexicon.flightbooking.dto.FlightListDTO;
import se.lexicon.flightbooking.entity.FlightBooking;
import se.lexicon.flightbooking.entity.FlightStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightBookingService {

    FlightBookingDTO bookFlight(Long flightId, BookFlightRequestDTO bookingRequest);

    void cancelFlight(Long flightId, String passengerEmail);

    List<FlightListDTO> findAll();

    List<AvailableFlightDTO> findAvailableFlights();

    List<FlightBookingDTO> findBookingsByEmail(String email);

    List<FlightListDTO> createFlights(FlightListDTO flightListDTO);

    List<FlightListDTO> bookedAllFlights(FlightStatus status);

    FlightListDTO updateFlight(Long id, FlightListDTO dto);

    List<FlightListDTO> findByDestination(String destinationAirport);

    List<AvailableFlightDTO> findByStatusAndDepartureAirportAndDestinationAirport(
            FlightStatus status,
            String departureAirport,
            String destinationAirport

    );

    FlightBookingDTO findByFlightNumberAndPassengerEmail(String flightNumber, String passengerEmail);

    List<FlightBooking> findBookingsByFlightNumberAndStatus(String flightNumber, FlightStatus status);

    List<AvailableFlightDTO> findBookingsByMaxPrice(Double maxPrice);
    List<FlightBookingDTO> fetchAllFlightList();


}
