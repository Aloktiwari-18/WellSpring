import React, { useState } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

// ✅ API_KEY aur MODEL env se lo
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_MODEL || "mistralai/mistral-7b-instruct";

// Simple sentiment detector
function detectSentiment(text: string): string {
  text = text.toLowerCase();
  if (
    text.includes("worthless") ||
    text.includes("suicide") ||
    text.includes("kill myself") ||
    text.includes("end my life")
  )
    return "crisis";
  if (
    text.includes("sad") ||
    text.includes("depressed") ||
    text.includes("tired")
  )
    return "sad";
  if (
    text.includes("happy") ||
    text.includes("excited") ||
    text.includes("great")
  )
    return "happy";
  if (text.includes("angry") || text.includes("frustrated")) return "angry";
  return "neutral";
}

const ChatbotAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm here to support you. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const mood = detectSentiment(userMessage.content);

    if (mood === "crisis") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "bot",
            content:
              "I'm really sorry you're feeling this way. Your life is valuable, and you deserve support. Please reach out to a professional. In India, you can call Kiran Helpline: 1800-599-0019 (24x7).",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1200);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`, // ✅ env key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are an empathetic and supportive AI friend.",
            },
            ...messages.map((msg) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.content,
            })),
            {
              role: "user",
              content: `Mood: ${mood}. Message: ${userMessage.content}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const botReply =
        data?.choices?.[0]?.message?.content ||
        "I'm here for you, even if words feel hard right now.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          type: "bot",
          content: botReply,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 3).toString(),
          type: "bot",
          content: `⚠️ Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg h-[600px] flex flex-col">
      <div className="flex items-center p-6 border-b border-gray-200">
        <MessageCircle className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">
          WellSpring Friend
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start max-w-xs lg:max-w-md ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === "user"
                    ? "bg-blue-500 ml-2"
                    : "bg-green-500 mr-2"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              <div
                className={`p-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-blue-500 text-white rounded-tr-sm"
                    : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start max-w-xs lg:max-w-md">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAssistant;
