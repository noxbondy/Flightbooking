package se.lexicon.flightbooking.service;

import org.springframework.ai.chat.messages.Message;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ChatClientService {

    String chatMemory(String question, String conversationId);

    String chatWithMemory(String query, String conversationId);
    Flux<String> chatWithMemoryRealTime(String query, String conversationId);
    void clearChatMemory(String conversationId);
    List<Message> getMessages(String conversationId);
}
