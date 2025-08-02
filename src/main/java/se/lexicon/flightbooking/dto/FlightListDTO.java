package se.lexicon.flightbooking.dto;

import java.time.LocalDateTime;

public record FlightListDTO(
        Long id,
        String flightNumber,
        String passengerName,
        String passengerEmail,
        String departureAirport,
        String destinationAirport,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        String status,
        Double price

) {


}
