package se.lexicon.flightbooking.dto;

import se.lexicon.flightbooking.entity.FlightStatus;

import java.time.LocalDateTime;

public record AvailableFlightDTO(
        Long id,
        String flightNumber,
        String departureAirport,
        String destinationAirport,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        FlightStatus status,  // ✅ Add this
        Double price
) {
}
