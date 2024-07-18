// src/Components/Chatbox.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Chatbox.css";
import Message from "./Message";

interface MessageType {
  sender: string;
  text: string;
  response?: {
    text: string;
    instruments?: { id: string; name: string }[];
  };
  actions?: string[];
}

const Chatbox: React.FC<{
  isAuthenticated: boolean;
  firstName?: string;
  userId?: string | null;
  onLogout: () => void;
}> = ({ isAuthenticated, firstName, userId, onLogout }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setMessages([]);
    const initialMessage: MessageType = isAuthenticated
      ? {
          sender: "bot",
          text: `Hi ${firstName}! How can I help you today?`,
          actions: ["Instruments searching", "Profile", "Logout"],
        }
      : {
          sender: "bot",
          text: "Hi! How can I help you today?",
          actions: ["Login", "Register", "About us"],
        };
    setMessages([initialMessage]);
  }, [isAuthenticated, firstName]);

  const handleActionClick = (action: string) => {
    const userActionMessage: MessageType = {
      sender: "user",
      text: action,
    };
    setMessages([...messages, userActionMessage]);

    switch (action) {
      case "Instruments searching":
        if (!isAuthenticated) {
          const botMessage: MessageType = {
            sender: "bot",
            text: "You need to log in to search for instruments. Would you like to log in or register?",
            actions: ["Login", "Register"],
          };
          setMessages([...messages, userActionMessage, botMessage]);
        } else {
          navigate("/search");
        }
        break;
      case "Profile":
        if (!isAuthenticated) {
          const botMessage: MessageType = {
            sender: "bot",
            text: "You need to log in to view your profile. Would you like to log in or register?",
            actions: ["Login", "Register"],
          };
          setMessages([...messages, userActionMessage, botMessage]);
        } else {
          navigate("/profile");
        }
        break;
      case "Logout":
        onLogout();
        navigate("/");
        break;
      case "Login":
        navigate("/login");
        break;
      case "Register":
        navigate("/register");
        break;
      case "About us":
        navigate("/about");
        break;
      default:
        console.error("Unknown action:", action);
    }

    if (action !== "Login" && action !== "Register") {
      const responseMessage: MessageType = {
        sender: "bot",
        text: `You chose ${action}. Here is the information you requested.`,
      };
      setMessages([...messages, userActionMessage, responseMessage]);
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage: MessageType = { sender: "user", text: input };
      const newMessages: MessageType[] = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");

      if (!isAuthenticated) {
        const botMessage: MessageType = {
          sender: "bot",
          text: "You need to log in to use our chatbox feature. Would you like to log in or register?",
          actions: ["Login", "Register"],
        };
        setMessages([...newMessages, botMessage]);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/messages",
          {
            text: input,
            userId: userId,
          }
        );
        const aiResponse = response.data.message.response;
        const botMessage: MessageType = {
          sender: "bot",
          text: aiResponse.text,
          response: aiResponse,
        };
        setMessages([...newMessages, botMessage]);
      } catch (error) {
        console.error("Error getting response:", error);
        const errorMessage: MessageType = {
          sender: "bot",
          text: "Sorry, I'm having trouble responding right now. Please try again later.",
        };
        setMessages([...newMessages, errorMessage]);
      }
    }
  };

  const handleInstrumentClick = (instrumentId: string) => {
    navigate(`/instrument/${instrumentId}`);
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <Message text={msg.text} sender={msg.sender} />
            {msg.response?.instruments && (
              <div className="instrument-links">
                {msg.response.instruments.map((instrument, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInstrumentClick(instrument.id)}
                    className="instrument-link-button"
                  >
                    {instrument.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {messages.length === 1 && messages[0].actions && (
          <div className="actions">
            {messages[0].actions.map((action, index) => (
              <button key={index} onClick={() => handleActionClick(action)}>
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
