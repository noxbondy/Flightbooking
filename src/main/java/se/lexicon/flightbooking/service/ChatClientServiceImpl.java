package se.lexicon.flightbooking.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatClientServiceImpl implements ChatClientService {

    private final ChatClient chatClient;
    private final ChatMemory chatMemory;
    private final AppToolCalling appToolCalling;

    @Autowired
    public ChatClientServiceImpl(ChatClient.Builder chatClientBuilder,
                                 ChatMemory chatMemory,
                                 AppToolCalling appToolCalling) {
        this.chatClient = chatClientBuilder
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
        this.chatMemory = chatMemory;
        this.appToolCalling = appToolCalling;
    }

    @Override
    public String chatMemory(String question, String conversationId) {
        ChatResponse chatResponse = this.chatClient.prompt()
                .system("""
                    You are a helpful flight assistant. You have access to the following tools, and you MUST use them whenever a user asks for real-time flight or booking information:

                    - getAvailableFlights(): to list all flights with available seats
                    - findBookingsByEmail(email: String): to find bookings for a customer
                    - findFlightsByDestination(destination: String): to find flights by destination
                    - findFlightsByMaxPrice(price: Double): to find flights under a given price
                    - bookAirTicket(flightId: Long, name: String, email: String): to book a flight
                    - cancelBooking(flightNumber: String, email: String): to cancel a booking
                    - checkBooking(flightNumber: String, email: String): to confirm an existing booking

                    Always respond using live data by calling the appropriate tools above.
                    Do NOT say “I cannot provide real-time information” — because you CAN.
                    """)
                .user(question)
                .tools(appToolCalling)
                .options(OpenAiChatOptions.builder()
                        .temperature(0.2)
                        .maxTokens(1000)
                        .build())
                .advisors(advisor -> advisor.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .chatResponse();

        Generation result = chatResponse != null ? chatResponse.getResult() : null;
        return result != null ? result.getOutput().getText() : "No response from assistant.";
    }


}