import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const ChatbotNoteIcon = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
  chatbot,
  content,
  showChatbot
}) => {

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = content;
    if (!showChatbot) {
        chatbot();
    } 

    // Update chat history with the user's message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // Delay 600 ms before showing "Thinking..." and generating response
    setTimeout(() => {
      // Add a "Thinking..." placeholder for the bot's response
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Thinking..." },
      ]);

      // Call the function to genrate the bot's response
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query: ${userMessage}`,
        },
      ]);
    }, 600);
  };

  return (
    <button onClick = {handleFormSubmit}>
      <ChatBubbleOutlineIcon />
    </button>
  );
}

export default ChatbotNoteIcon;
