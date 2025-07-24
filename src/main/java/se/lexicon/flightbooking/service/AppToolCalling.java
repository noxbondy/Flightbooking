package se.lexicon.flightbooking.service;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;
import se.lexicon.flightbooking.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking.dto.FlightBookingDTO;
import se.lexicon.flightbooking.entity.FlightBooking;
import se.lexicon.flightbooking.entity.FlightStatus;
import se.lexicon.flightbooking.repository.FlightRepository;

@Component
public class AppToolCalling {

    private final FlightBookingService flightBookingService;
    private final FlightRepository flightRepository;

    @Autowired
    public AppToolCalling(FlightBookingService flightBookingService, FlightRepository flightRepository) {
        this.flightBookingService = flightBookingService;
        this.flightRepository = flightRepository;
    }

    @Tool(name = "bookAirTicket", description = "Books an air ticket using flight ID, passenger name, and email")
    public String bookAirTicket(Long flightId, String name, String email) {
        try {
            BookFlightRequestDTO request = new BookFlightRequestDTO(name, email);
            var response = flightBookingService.bookFlight(flightId, request);
            return "✅ Ticket booked successfully: " + response.flightNumber() + " for " + name;
        } catch (Exception e) {
            return "❌ Booking failed: " + e.getMessage();
        }
    }

    @Tool(description = "Get all active flights from the database.")
    public List<String> getAvailableFlights() {
        var flights = flightRepository.findByStatus(FlightStatus.AVAILABLE);
        if (flights.isEmpty()) return List.of("No available flights found.");

        return flights.stream()
                .map(f -> "✈️ " + f.getFlightNumber() + ": " + f.getDepartureAirport() + " to " + f.getDestinationAirport() +
                        " at " + f.getDepartureTime() + " - Price: $" + f.getPrice())
                .toList();
    }

    @Tool(description = "Find bookings by passenger email.")
    public List<String> findBookingsByEmail(String email) {
        List<FlightBooking> bookings = flightRepository.findByPassengerEmail(email);
        if (bookings.isEmpty()) return List.of("No bookings found for email: " + email);

        return bookings.stream()
                .map(b -> "📄 Booking ID " + b.getId() + ": " + b.getFlightNumber() + " from " +
                        b.getDepartureAirport() + " to " + b.getDestinationAirport() +
                        " at " + b.getDepartureTime() + " (Status: " + b.getStatus() + ")")
                .toList();
    }

    @Tool(name = "FindFlightsByDestination", description = "Find available flights for a given destination airport.")
    public List<String> findFlightsByDestination(String destination) {
        List<FlightBooking> flights = flightRepository.findByDestinationAirportIgnoreCase(destination);

        if (flights.isEmpty()) {
            return List.of("No flights found to: " + destination);
        }

        return flights.stream()
                .map(f -> String.format("✈️ Flight %s from %s to %s on %s, Price: €%.2f",
                        f.getFlightNumber(),
                        f.getDepartureAirport(),
                        f.getDestinationAirport(),
                        f.getDepartureTime(),
                        f.getPrice()))
                .collect(Collectors.toList());
    }

    @Tool(description = "Find flights under or equal to a given price.")
    public List<String> findFlightsByMaxPrice(Double maxPrice) {
        List<FlightBooking> flights = flightRepository.findByPriceLessThanEqual(maxPrice);
        if (flights.isEmpty()) return List.of("No flights found below or equal to $" + maxPrice);

        return flights.stream()
                .map(f -> "💰 " + f.getFlightNumber() + " - $" + f.getPrice() +
                        " from " + f.getDepartureAirport() + " to " + f.getDestinationAirport())
                .toList();
    }

    @Tool(description = "Cancel a booking using flight number and email.")
    public String cancelBooking(String flightNumber, String email) {
        FlightBooking booking = flightRepository.findByFlightNumberAndPassengerEmail(flightNumber, email);
        if (booking == null) {
            return "❌ No booking found for flight " + flightNumber + " with email " + email;
        }

        booking.setStatus(FlightStatus.CANCELLED);
        flightRepository.save(booking);
        return "✅ Booking for flight " + flightNumber + " has been cancelled.";
    }

    @Tool(description = "Check if a passenger is booked on a flight.")
    public String checkBooking(String flightNumber, String email) {
        FlightBooking booking = flightRepository.findByFlightNumberAndPassengerEmail(flightNumber, email);
        if (booking == null) {
            return "No booking found.";
        }
        return "✅ Found booking: " + booking.getFlightNumber() + " from " + booking.getDepartureAirport() +
                " to " + booking.getDestinationAirport() + " (Status: " + booking.getStatus() + ")";
    }


}