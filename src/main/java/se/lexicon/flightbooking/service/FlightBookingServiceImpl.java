package se.lexicon.flightbooking.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.lexicon.flightbooking.dto.*;
import se.lexicon.flightbooking.entity.FlightBooking;
import se.lexicon.flightbooking.entity.FlightStatus;
import se.lexicon.flightbooking.mapper.FlightBookingMapper;
import se.lexicon.flightbooking.mapper.FlightMapper;
import se.lexicon.flightbooking.repository.FlightRepository;

import java.util.List;
import java.util.stream.Collectors;

import static se.lexicon.flightbooking.mapper.FlightMapper.toFlightListDTO;

@Service
@Transactional
@RequiredArgsConstructor
public class FlightBookingServiceImpl implements FlightBookingService {

    private final FlightRepository flightRepository;
    private final FlightBookingMapper mapper;

    @Override
    public FlightBookingDTO bookFlight(Long flightId, BookFlightRequestDTO bookingRequest) {
        FlightBooking flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (flight.getStatus() != FlightStatus.AVAILABLE) {
            throw new RuntimeException("Flight is not available");
        }

        flight.setPassengerName(bookingRequest.passengerName());
        flight.setPassengerEmail(bookingRequest.passengerEmail());
        flight.setStatus(FlightStatus.BOOKED);

        FlightBooking saved = flightRepository.save(flight);
        return mapper.toDTO(saved);
    }

    @Override
    public void cancelFlight(Long flightId, String passengerEmail) {
        FlightBooking flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (!flight.getPassengerEmail().equals(passengerEmail)) {
            throw new RuntimeException("Passenger email does not match");
        }

        flight.setPassengerName(null);
        flight.setPassengerEmail(null);
        flight.setStatus(FlightStatus.AVAILABLE);
        flightRepository.save(flight);
    }

    @Override
    public List<AvailableFlightDTO> findAvailableFlights() {
        return flightRepository.findByStatus(FlightStatus.AVAILABLE)
                .stream()
                .map(mapper::toAvailableFlightDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightListDTO> bookedAllFlights(FlightStatus status) {
        return flightRepository.findByStatus(status)
                .stream()
                .map(FlightMapper::toFlightListDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightBookingDTO> findBookingsByEmail(String email) {
        return flightRepository.findByPassengerEmail(email)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightListDTO> findAll() {
        return flightRepository.findAll()
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

        FlightBooking saved = flightRepository.save(newFlight);
        return List.of(mapper.toListDTO(saved));
    }

    @Override
    public FlightListDTO updateFlight(Long id, FlightListDTO dto) {
        FlightBooking flight = flightRepository.findById(id)
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

        flightRepository.save(flight);
        return toFlightListDTO(flight);
    }

    @Override
    public List<FlightListDTO> findByDestination(String destinationAirport) {
        return flightRepository.findByDestinationAirport(destinationAirport)
                .stream()
                .map(FlightMapper::toFlightListDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailableFlightDTO> findByStatusAndDepartureAirportAndDestinationAirport(
            FlightStatus status,
            String departureAirport,
            String destinationAirport) {

        String dep = departureAirport == null ? "" : departureAirport.trim();
        String dest = destinationAirport == null ? "" : destinationAirport.trim();

        List<FlightBooking> flights = flightRepository
                .findByStatusAndDepartureAirportAndDestinationAirport(status, dep, dest);

        return flights.stream()
                .map(mapper::toAvailableFlightDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FlightBookingDTO findByFlightNumberAndPassengerEmail(String flightNumber, String passengerEmail) {
        FlightBooking booking = flightRepository
                .findByFlightNumberAndPassengerEmail(flightNumber, passengerEmail);

        if (booking == null) {
            throw new RuntimeException("Booking not found for flight number: " + flightNumber + " and email: " + passengerEmail);
        }

        return mapper.toDTO(booking);
    }

    @Override
    public List<FlightBooking> findBookingsByFlightNumberAndStatus(String flightNumber, FlightStatus status) {
        return flightRepository.findByFlightNumberAndStatus(flightNumber, status);
    }

    @Override
    public List<AvailableFlightDTO> findBookingsByMaxPrice(Double maxPrice) {
        return flightRepository.findByPriceLessThanEqual(maxPrice)
                .stream()
                .map(mapper::toAvailableFlightDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightBookingDTO> fetchAllFlightList() {
        return flightRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFlight(Long id) {
        FlightBooking flightBooking = flightRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Flight with id " + id + " not found"));

        flightRepository.delete(flightBooking);
    }
}