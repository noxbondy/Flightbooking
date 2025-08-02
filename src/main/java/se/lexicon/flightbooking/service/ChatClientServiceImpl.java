package se.lexicon.flightbooking.service;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;

@Service
public class ChatClientServiceImpl implements ChatClientService {
    private final ChatClient chatClient;
    private final ChatMemory chatMemory;
    private final AppToolCalling appToolCalling;
    private final String systemMessage = """
            You are a helpful flight booking assistant. Your role is to help users:
            - Find available flights
            - Book flights
            - Cancel bookings
            - Check their existing bookings
            
            Always be polite and confirm actions with users before executing them.
            When showing flight information, include all relevant details.
            For bookings, always confirm passenger details before proceeding.
            """;

    @Autowired
    public ChatClientServiceImpl(ChatMemory chatMemory, ChatClient.Builder chatClient, AppToolCalling appToolCalling ){
        this.chatMemory = chatMemory;
        this.appToolCalling = appToolCalling;
        this.chatClient = chatClient
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(this.chatMemory).build())
                .build();
    }

    @Override
    public String chatWithMemory(String query, String conversationId) {
        ChatResponse chatResponse = this.chatClient
                .prompt()
                .user(query)
                .system(systemMessage)
                .tools(appToolCalling)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, conversationId))
                .options(OpenAiChatOptions.builder()
                        .temperature(0.2)
                        .maxTokens(1000)
                        .build())
                .call()
                .chatResponse();

        Generation result = null;
        if (chatResponse != null)
            result = chatResponse.getResult();
        return result != null ? result.getOutput().getText() : "No response received.";
    }

    @Override
    public Flux<String> chatWithMemoryRealTime(String query, String conversationId) {
        Flux<ChatResponse> chatResponse = this.chatClient
                .prompt()
                .user(query)
                .system(systemMessage)
                .tools(appToolCalling)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, conversationId))
                .options(OpenAiChatOptions.builder()
                        .temperature(0.2)
                        .maxTokens(1000)
                        .build())
                .stream()
                .chatResponse();

        try {
            return chatResponse.flatMapIterable(ChatResponse::getResults)
                    .mapNotNull(result -> result.getOutput().getText());
        } catch (RuntimeException e){
            throw new RuntimeException("Error processing chat query:" + e.getMessage());
        }
    }

    @Override
    public List<Message> getMessages(String conversationId){
        return chatMemory.get(conversationId);
    }

    @Override
    public void clearChatMemory(String conversationId) {
        this.chatMemory.clear(conversationId);
    }

    @Override
    public String chatMemory(String question, String conversationId) {
        return "";
    }
}