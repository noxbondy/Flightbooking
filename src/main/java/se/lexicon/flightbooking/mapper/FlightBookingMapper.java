package se.lexicon.flightbooking.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking.dto.AvailableFlightDTO;
import se.lexicon.flightbooking.dto.FlightBookingDTO;
import se.lexicon.flightbooking.dto.FlightListDTO;
import se.lexicon.flightbooking.entity.FlightBooking;

@Component
public class FlightBookingMapper {


    public FlightBookingDTO toDTO(FlightBooking entity) {
        return new FlightBookingDTO(
                entity.getId(),
                entity.getFlightNumber(),
                entity.getDepartureAirport(),
                entity.getDestinationAirport(),
                entity.getDepartureTime(),
                entity.getArrivalTime(),
                entity.getPassengerName(),          // ✅ Correctly added
                entity.getPassengerEmail(),         // ✅ Now in correct place
                entity.getStatus().toString(),
                entity.getPrice()
        );
    }

    public AvailableFlightDTO toAvailableFlightDTO(FlightBooking entity) {
        return new AvailableFlightDTO(
                entity.getId(),
                entity.getFlightNumber(),
                entity.getDepartureAirport(),
                entity.getDestinationAirport(),
                entity.getDepartureTime(),
                entity.getArrivalTime(),
                entity.getStatus(),
                entity.getPrice()
        );
    }

    public FlightListDTO toListDTO(FlightBooking entity) {
        return new FlightListDTO(
                entity.getId(),
                entity.getFlightNumber(),
                entity.getPassengerName(),
                entity.getPassengerEmail(),
                entity.getDepartureAirport(),
                entity.getDestinationAirport(),
                entity.getDepartureTime(),
                entity.getArrivalTime(),
                entity.getStatus().toString(),
                entity.getPrice()
        );
    }

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
