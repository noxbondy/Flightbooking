package se.lexicon.flightbooking.controller;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import se.lexicon.flightbooking.service.AppToolCalling;
import se.lexicon.flightbooking.service.ChatClientService;
import se.lexicon.flightbooking.service.OpenAIService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chat")
public class OpenAIController {

    private final OpenAIService service;
    private final ChatClientService clientService;
    private final AppToolCalling appToolCalling;

    @Autowired
    public OpenAIController(OpenAIService service, ChatClientService clientService, AppToolCalling appToolCalling) {
        this.service = service;
        this.clientService = clientService;
        this.appToolCalling = appToolCalling;
    }

    @GetMapping
    public String welcome() {
        return "Welcome to the OpenAI Chat API!";
    }

    @GetMapping("/messages")
    public String processSimpleChatQuery(
            @NotNull(message = "Question cannot be null")
            @NotBlank(message = "Question cannot be blank")
            @Size(max = 200, message = "Question cannot exceed 200 characters")
            @RequestParam String question
    ) {
        return service.processSimpleChatQuery(question);
    }

    @GetMapping("/messages/new-chat-memory")
    public String newChatMemory(@RequestParam
                                @NotNull(message = "Conversation ID cannot be null")
                                @NotBlank(message = "Conversation ID cannot be blank")
                                @Size(max = 36, message = "Conversation ID cannot exceed 36 characters")
                                String conversationId,
                                @RequestParam
                                @NotNull(message = "Question cannot be null")
                                @NotBlank(message = "Question cannot be blank")
                                @Size(max = 200, message = "Question cannot exceed 200 characters")
                                String question) {
        System.out.println("conversationId = " + conversationId);
        System.out.println("question = " + question);
        return clientService.chatMemory(question, conversationId);
    }

    @GetMapping("/test-flights-by-destination")
    public List<String> testFlightsByDestination(@RequestParam String destination) {
        return appToolCalling.findFlightsByDestination(destination);
    }



}