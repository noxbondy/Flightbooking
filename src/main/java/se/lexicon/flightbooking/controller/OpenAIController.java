package se.lexicon.flightbooking.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import se.lexicon.flightbooking.service.ChatClientService;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chat")
public class OpenAIController {

    private final ChatClientService chatClientService;

    @Autowired
    public OpenAIController(ChatClientService chatClientService) {
        this.chatClientService = chatClientService;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestParam String conversationId, @RequestBody ChatRequest request) {
        if (request.getQuery() == null || request.getQuery().isBlank()) {
            return ResponseEntity.badRequest().body("Query cannot be empty");
        }
        try {
            String response = chatClientService.chatWithMemory(request.getQuery(), conversationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Error processing request: " + e.getMessage());
        }
    }

    @PostMapping("/chat/stream")
    public Flux<String> chatStream(@RequestParam String conversationId, @RequestBody ChatRequest request) {
        return chatClientService.chatWithMemoryRealTime(request.getQuery(), conversationId);
    }

    @GetMapping("/chat/history/{conversationId}")
    public ResponseEntity<List<?>> getMessages(@PathVariable String conversationId) {
        return ResponseEntity.ok(chatClientService.getMessages(conversationId));
    }

    @DeleteMapping("/chat/clear/{conversationId}")
    public ResponseEntity<String> clearChat(@PathVariable String conversationId) {
        chatClientService.clearChatMemory(conversationId);
        return ResponseEntity.ok("✅ Chat memory cleared for conversation ID: " + conversationId);
    }

    // Optional test endpoint
    @GetMapping("/ping")
    public String ping() {
        return "Flight Booking Assistant is up and running 🚀";
    }

    // Inner static class to receive query
    public static class ChatRequest {
        private String query;

        public ChatRequest() {
        }

        public ChatRequest(String query) {
            this.query = query;
        }

        public String getQuery() {
            return query;
        }

        public void setQuery(String query) {
            this.query = query;
        }
    }
}




