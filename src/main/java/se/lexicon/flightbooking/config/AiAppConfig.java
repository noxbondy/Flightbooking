package se.lexicon.flightbooking.config;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import se.lexicon.flightbooking.service.AppToolCalling;

import java.util.List;

@Configuration
@ComponentScan("se.lexicon.flightbooking.*")
public class AiAppConfig {

    // Define ChatMemory bean (holds recent chat messages)
    @Bean
    public ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder()
                .maxMessages(10)  // Keep last 10 messages in memory
                .build();
    }


}