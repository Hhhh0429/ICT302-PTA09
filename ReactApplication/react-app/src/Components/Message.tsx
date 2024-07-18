import React from "react";
import "./Message.css";

interface MessageProps {
  text: string;
  sender: string;
}

const Message: React.FC<MessageProps> = ({ text, sender }) => {
  return <div className={`message ${sender}`}>{text}</div>;
};

export default Message;
