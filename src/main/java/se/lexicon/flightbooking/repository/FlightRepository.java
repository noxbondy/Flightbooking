package se.lexicon.flightbooking.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.lexicon.flightbooking.dto.FlightBookingDTO;
import se.lexicon.flightbooking.entity.FlightBooking;
import se.lexicon.flightbooking.entity.FlightStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<FlightBooking, Long> {

    List<FlightBooking> findByStatus(FlightStatus status);

    List<FlightBooking> findByPassengerEmail(String email);

    List<FlightBooking> findByDestinationAirport(String destination);

    List<FlightBooking> findByDepartureTimeBetween(LocalDateTime start, LocalDateTime end);

    FlightBooking findByFlightNumberAndPassengerEmail(String flightNumber, String passengerEmail);

    List<FlightBooking> findByStatusAndDepartureAirportAndDestinationAirport(
            FlightStatus status,
            String departureAirport,
            String destinationAirport);

    List<FlightBooking> findByPriceLessThanEqual(Double maxPrice);

    List<FlightBooking> findByFlightNumberAndStatus(String flightNumber, FlightStatus status);

    List<FlightBooking> findByDestinationAirportIgnoreCase(String destination);
}
