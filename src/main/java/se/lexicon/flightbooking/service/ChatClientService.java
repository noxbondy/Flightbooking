package se.lexicon.flightbooking.service;

import org.springframework.ai.chat.messages.Message;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ChatClientService {

    String chatMemory(String question);

    String chatWithMemory(String query);
    Flux<String> chatWithMemoryRealTime(String query);
    void clearChatMemory();
    List<Message> getMessages();
}
