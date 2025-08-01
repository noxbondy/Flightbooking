import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const baseUrl = "http://localhost:8080/api/chat/messages";
      const params = new URLSearchParams(
        conversationId
          ? { conversationId, question: input }
          : { question: input }
      );

      const url = conversationId
        ? `${baseUrl}/new-chat-memory?${params.toString()}`
        : `${baseUrl}?${params.toString()}`;

      const res = await fetch(url);
      const botText = await res.text();

      setMessages((prev) => [...prev, { from: "bot", text: botText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error fetching response." },
      ]);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const searchFlights = async () => {
    if (!destination.trim()) return;

    setLoading(true);
    setError("");
    setFlights([]);

    try {
      const response = await fetch(
        `http://localhost:8080/api/chat/test-flights-by-destination?destination=${encodeURIComponent(
          destination
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError("❌ Error fetching flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "70px",
          right: "20px",
          zIndex: 9999,
          padding: "10px 15px",
          borderRadius: "25px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        {open ? "Close Chat" : "Chat"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "110px",
            right: "20px",
            width: "340px",
            height: "440px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
          }}
        >
          {/* Optional Conversation ID input */}
          <input
            type="text"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Conversation ID (optional)"
            style={{
              border: "none",
              borderBottom: "1px solid #ccc",
              padding: "10px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              background: "#f9f9f9",
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: "#999" }}>Start chatting...</div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "10px",
                  textAlign: msg.from === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    backgroundColor:
                      msg.from === "user" ? "#007bff" : "#e5e5ea",
                    color: msg.from === "user" ? "white" : "black",
                    maxWidth: "75%",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{ display: "flex", borderTop: "1px solid #ddd" }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: "none",
                padding: "10px",
                fontSize: "14px",
                resize: "none",
              }}
            />
            <button
              type="submit"
              style={{
                border: "none",
                backgroundColor: "#007bff",
                color: "white",
                padding: "0 15px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
