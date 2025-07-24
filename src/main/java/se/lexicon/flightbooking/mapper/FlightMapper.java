package se.lexicon.flightbooking.mapper;

import se.lexicon.flightbooking.dto.FlightListDTO;
import se.lexicon.flightbooking.entity.FlightBooking;

public class FlightMapper {
    public static FlightListDTO toFlightListDTO(FlightBooking booking) {
        return new FlightListDTO(
                booking.getId(),
                booking.getFlightNumber(),
                booking.getPassengerName(),
                booking.getPassengerEmail(),
                booking.getDepartureAirport(),
                booking.getDestinationAirport(),
                booking.getDepartureTime(),
                booking.getArrivalTime(),
                booking.getStatus().name(),
                booking.getPrice()
        );
    }
}
