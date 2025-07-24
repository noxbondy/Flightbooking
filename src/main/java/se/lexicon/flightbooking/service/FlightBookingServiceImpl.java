package se.lexicon.flightbooking.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.lexicon.flightbooking.dto.AvailableFlightDTO;
import se.lexicon.flightbooking.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking.dto.FlightBookingDTO;
import se.lexicon.flightbooking.dto.FlightListDTO;

import se.lexicon.flightbooking.entity.FlightBooking;
import se.lexicon.flightbooking.entity.FlightStatus;
import se.lexicon.flightbooking.mapper.FlightBookingMapper;
import se.lexicon.flightbooking.mapper.FlightMapper;
import se.lexicon.flightbooking.repository.FlightRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static se.lexicon.flightbooking.mapper.FlightBookingMapper.toFlightListDTO;

@Service
@Transactional
@RequiredArgsConstructor
public class FlightBookingServiceImpl implements FlightBookingService {

    private final FlightRepository flightBookingRepository;
    private final FlightBookingMapper mapper;
    private final FlightBookingMapper flightBookingMapper;


    @Override
    public FlightBookingDTO bookFlight(Long flightId, BookFlightRequestDTO bookingRequest) {
        FlightBooking flight = flightBookingRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (flight.getStatus() != FlightStatus.AVAILABLE) {
            throw new RuntimeException("Flight is not available");
        }

        flight.setPassengerName(bookingRequest.passengerName());
        flight.setPassengerEmail(bookingRequest.passengerEmail());
        flight.setStatus(FlightStatus.BOOKED);

        FlightBooking savedFlight = flightBookingRepository.save(flight);
        return mapper.toDTO(savedFlight);
    }

    @Override
    public void cancelFlight(Long flightId, String passengerEmail) {
        FlightBooking flight = flightBookingRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (!flight.getPassengerEmail().equals(passengerEmail)) {
            throw new RuntimeException("Passenger email does not match");
        }

        flight.setStatus(FlightStatus.AVAILABLE);
        flightBookingRepository.save(flight);
    }

    @Override
    public List<AvailableFlightDTO> findAvailableFlights() {
        return flightBookingRepository.findByStatus(FlightStatus.AVAILABLE)
                .stream()
                .map(mapper::toAvailableFlightDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightListDTO> bookedAllFlights(FlightStatus status) {
        return flightBookingRepository.findByStatus(status)
                .stream()
                .map(FlightMapper::toFlightListDTO) // ✅ Must be static and import must be correct
                .collect(Collectors.toList());
    }




    @Override
    public List<FlightBookingDTO> findBookingsByEmail(String email) {
        return flightBookingRepository.findByPassengerEmail(email)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightListDTO> findAll() {
        return flightBookingRepository.findAll()
                .stream()
                .map(mapper::toListDTO)
                .collect(Collectors.toList());
    }


    @Override
    public List<FlightListDTO> createFlights(FlightListDTO flightListDTO) {
        FlightBooking newFlight = FlightBooking.builder()
                .flightNumber(flightListDTO.flightNumber())
                .departureAirport(flightListDTO.departureAirport())
                .destinationAirport(flightListDTO.destinationAirport())
                .departureTime(flightListDTO.departureTime())
                .arrivalTime(flightListDTO.arrivalTime())
                .status(FlightStatus.valueOf(flightListDTO.status()))
                .price(flightListDTO.price())
                .passengerName(null)
                .passengerEmail(null)
                .build();

        FlightBooking saved = flightBookingRepository.save(newFlight);

        return List.of(mapper.toListDTO(saved));
    }

    @Override
    public FlightListDTO updateFlight(Long id, FlightListDTO dto) {
        FlightBooking flight = flightBookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Flight not found"));

        flight.setFlightNumber(dto.flightNumber());
        flight.setDepartureAirport(dto.departureAirport());
        flight.setDestinationAirport(dto.destinationAirport());
        flight.setDepartureTime(dto.departureTime());
        flight.setArrivalTime(dto.arrivalTime());
        flight.setStatus(FlightStatus.valueOf(dto.status()));
        flight.setPassengerName(dto.passengerName());
        flight.setPassengerEmail(dto.passengerEmail());
        flight.setPrice(dto.price());

        flightBookingRepository.save(flight);

        return toFlightListDTO(flight);
    }

    @Override
    public List<FlightListDTO> findByDestination(String destinationAirport) {
        List<FlightBooking> flights = flightBookingRepository.findByDestinationAirport(destinationAirport);
        return flights.stream()
                .map(FlightMapper::toFlightListDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailableFlightDTO> findByStatusAndDepartureAirportAndDestinationAirport(FlightStatus status, String departureAirport, String destinationAirport) {
        String dep = departureAirport == null ? "" : departureAirport.trim();
        String dest = destinationAirport == null ? "" : destinationAirport.trim();

        System.out.println("STATUS: " + status);
        System.out.println("DEPARTURE: '" + dep + "'");
        System.out.println("DESTINATION: '" + dest + "'");


        List<FlightBooking> bookings = flightBookingRepository
                .findByStatusAndDepartureAirportAndDestinationAirport(
                        status, dep, dest
                );

        return bookings.stream()
                .map(flightBookingMapper::toAvailableFlightDTO)
                .collect(Collectors.toList());
    }


    @Override
    public FlightBookingDTO findByFlightNumberAndPassengerEmail(String flightNumber, String passengerEmail) {
        FlightBooking booking = flightBookingRepository
                .findByFlightNumberAndPassengerEmail(flightNumber, passengerEmail);

        if (booking == null) {
            throw new RuntimeException("Booking not found for flight number: " + flightNumber + " and email: " + passengerEmail);
        }

        return flightBookingMapper.toDTO(booking);
    }

    @Override
    public List<FlightBooking> findBookingsByFlightNumberAndStatus(String flightNumber, FlightStatus status) {
        return flightBookingRepository.findByFlightNumberAndStatus(flightNumber, status);
    }

    @Override
    public List<AvailableFlightDTO> findBookingsByMaxPrice(Double maxPrice) {
        List<FlightBooking> bookings = flightBookingRepository.findByPriceLessThanEqual(maxPrice);
        return bookings.stream()
                .map(flightBookingMapper::toAvailableFlightDTO)
                .collect(Collectors.toList());
    }
}
