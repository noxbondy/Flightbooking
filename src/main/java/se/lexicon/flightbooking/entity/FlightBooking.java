package se.lexicon.flightbooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class FlightBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String flightNumber;
    @Column(nullable = false)
    private String departureAirport;
    @Column(nullable = false)
    private String destinationAirport;
    @Column(nullable = false)
    private LocalDateTime departureTime;
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    @Column(nullable = false)
    private String passengerName;
    @Column(nullable = true)
    private String passengerEmail;
    @Enumerated(EnumType.STRING)
    private FlightStatus status;
    private double price;
}
