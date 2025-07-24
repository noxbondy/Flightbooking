package se.lexicon.flightbooking.dto;

import java.time.LocalDateTime;

public record FlightBookingDTO(
        Long id,
        String flightNumber,
        String departureAirport,
        String destinationAirport,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        String passengerName,
        String passengerEmail,
        String status,
        Double price
) {
}
