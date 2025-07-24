package se.lexicon.flightbooking.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.lexicon.flightbooking.dto.AvailableFlightDTO;
import se.lexicon.flightbooking.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking.dto.FlightBookingDTO;
import se.lexicon.flightbooking.dto.FlightListDTO;
import se.lexicon.flightbooking.entity.FlightBooking;
import se.lexicon.flightbooking.entity.FlightStatus;
import se.lexicon.flightbooking.service.FlightBookingService;

import java.time.LocalDateTime;
import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@Tag(name = "Flight Booking API", description = "APIs for flight booking operations")
public class FlightBookingController {

    private final FlightBookingService flightBookingService;

    @PostMapping("/createFlight")
    public ResponseEntity<List<FlightListDTO>> createFlight(@RequestBody FlightListDTO flightListDTO) {
        List<FlightListDTO> createdFlights = flightBookingService.createFlights(flightListDTO);
        return new ResponseEntity<>(createdFlights, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all flights", description = "Returns a list of all flights")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all flights")
    @GetMapping
    public ResponseEntity<List<FlightListDTO>> getAllFlights() {
        return ResponseEntity.ok(flightBookingService.findAll());
    }

    @Operation(summary = "Get available flights", description = "Returns a list of all available flights")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved available flights")
    @GetMapping("/available")
    public ResponseEntity<List<AvailableFlightDTO>> getAvailableFlights() {
        return ResponseEntity.ok(flightBookingService.findAvailableFlights());
    }
    @Operation(summary = "Get booked flights by flight number", description = "Retrieves all booked passengers for a specific flight")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booked flights retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "No booked flights found for this flight number")
    })


    @GetMapping("/booked")
    public ResponseEntity<List<FlightListDTO>> getAllBookedFlights(
            @RequestParam FlightStatus status) {
        List<FlightListDTO> bookedFlights = flightBookingService.bookedAllFlights(status);
        return ResponseEntity.ok(bookedFlights);
    }

    @Operation(summary = "Book a flight", description = "Books a flight for a passenger")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flight successfully booked"),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content),
            @ApiResponse(responseCode = "400", description = "Flight not available", content = @Content)
    })
    @PostMapping("/{flightId}/book")
    public ResponseEntity<FlightBookingDTO> bookFlight(
            @Parameter(description = "ID of the flight to book") @PathVariable Long flightId,
            @Parameter(description = "Booking request details") @RequestBody BookFlightRequestDTO bookingRequest) {
        return ResponseEntity.ok(flightBookingService.bookFlight(flightId, bookingRequest));
    }

    @Operation(summary = "Get bookings by email", description = "Returns all bookings for a given email")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved bookings")
    @GetMapping("/bookings")
    public ResponseEntity<List<FlightBookingDTO>> getBookingsByEmail(
            @Parameter(description = "Email to search bookings for") @RequestParam String email) {
        return ResponseEntity.ok(flightBookingService.findBookingsByEmail(email));
    }

    @Operation(summary = "Cancel a flight booking", description = "Cancels a flight booking for a given flight ID and email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Flight successfully cancelled"),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid email for the booking", content = @Content)
    })
    @DeleteMapping("/{flightId}/cancel")
    public ResponseEntity<Void> cancelFlight(
            @Parameter(description = "ID of the flight to cancel") @PathVariable Long flightId,
            @Parameter(description = "Email associated with the booking") @RequestParam String email) {
        flightBookingService.cancelFlight(flightId, email);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<FlightListDTO> updateFlight(
            @PathVariable Long id,
            @RequestBody FlightListDTO dto) {
        FlightListDTO updatedFlight = flightBookingService.updateFlight(id, dto);
        return ResponseEntity.ok(updatedFlight);
    }

    @GetMapping("/destination")
    public ResponseEntity<List<FlightListDTO>> getFlightsByDestination(
            @RequestParam String destination) {
        List<FlightListDTO> flights = flightBookingService.findByDestination(destination);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AvailableFlightDTO>> searchFlights(
            @RequestParam FlightStatus status,
            @RequestParam String departureAirport,
            @RequestParam String destinationAirport

            ) {

        List<AvailableFlightDTO> flights = flightBookingService
                .findByStatusAndDepartureAirportAndDestinationAirport(status, departureAirport, destinationAirport);

        return ResponseEntity.ok(flights);
    }

    @GetMapping("/findbooking")
    public ResponseEntity<FlightBookingDTO> getBookingByFlightNumberAndEmail(
            @RequestParam String flightNumber,
            @RequestParam String passengerEmail) {

        try {
            FlightBookingDTO booking = flightBookingService.findByFlightNumberAndPassengerEmail(flightNumber, passengerEmail);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Find bookings by flight number and status",
            description = "Returns a list of bookings matching the given flight number and status")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved bookings")
    @GetMapping("/bookings/search/flightNumber")
    public ResponseEntity<List<FlightBooking>> getBookingsByFlightNumberAndStatus(
            @RequestParam String flightNumber,
            @RequestParam FlightStatus status) {
        List<FlightBooking> bookings = flightBookingService.findBookingsByFlightNumberAndStatus(flightNumber, status);
        return ResponseEntity.ok(bookings);
    }

    @Operation(
            summary = "Find available flights by max price",
            description = "Returns a list of available flights where price is less than or equal to the given value"
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved flights")
    @GetMapping("/filter-by-price")
    public ResponseEntity<List<AvailableFlightDTO>> getFlightsByMaxPrice(
            @Parameter(description = "Maximum price (inclusive) for available flights")
            @RequestParam Double maxPrice) {

        List<AvailableFlightDTO> result = flightBookingService.findBookingsByMaxPrice(maxPrice);
        return ResponseEntity.ok(result);
    }

}
