package se.lexicon.flightbooking.service;
import org.apache.logging.log4j.message.Message;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import se.lexicon.flightbooking.dto.FlightBookingDTO;

import java.util.List;

public interface OpenAIService {

    String chatWithMemory(String query, String conversationId);
    Flux<String> chatWithMemoryRealTime(String query, String conversationId);
    void clearChatMemory(String conversationId);
    List<Message> getMessages(String conversationId);
}
