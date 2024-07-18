import React from "react";
import "./HelpAssistantIcon.css";

const HelpAssistantIcon: React.FC<{ toggleChatbox: () => void }> = ({
  toggleChatbox,
}) => {
  return (
    <div>
      <div className="help-icon" onClick={toggleChatbox}>
        💬
      </div>
    </div>
  );
};

export default HelpAssistantIcon;
