import React, { useState, useEffect, useRef } from "react";
import "../styles/main.css";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import Login from "./Login";
import CreateArea from "./CreateArea";
import { getList, addItem, deleteItem, editItem } from "../services/list";
import useToken from "./useToken";
import { jwtDecode } from "jwt-decode";
import Chatbot from "./Chatbot";
import { companyInfo } from "../services/companyinfo";

function Main() {
  const [notes, setNotes] = useState([]);
  const [alert, setAlert] = useState(false);
  const { token, setToken } = useToken();
  const [userId, setUserId] = useState();
  const [showChatbot, setShowChatbot] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    if (token) {
      setUserId(jwtDecode(token).id);
    }
  }, [token]);

  useEffect(() => {
    mounted.current = true;
    if (notes.length && !alert) {
      return;
    }
    if (userId && token) {
      getList(userId, token).then((notes) => {
        if (mounted.current) {
          setNotes(notes);
        }
      });
    }
    return () => (mounted.current = false);
  }, [alert, userId, token]);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        if (mounted.current) {
          setAlert(false);
        }
      }, 1000);
    }
  }, [alert]);

  function addNote(newNote) {
    addItem(newNote, userId, token).then(() => {
      setAlert(true);
    });
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    deleteItem(id, token);
    setNotes((prevNotes) => {
      console.log(prevNotes);
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== id;
      });
    });
  }

  function editNote(id, title, content) {
    editItem(id, title, content, token);
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, title, content } : note))
    );
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setNotes([]);
  }

  function chatbot() {
    setShowChatbot((prev) => !prev);
  }

  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);
  // const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    // console.log(history);

    // Helper function to update chat history
    const updateHistory = (text, isError) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };
    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Make the API call to get the bot's response
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
      console.log(data);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="main">
      <Header logout={logout} />
      <CreateArea onAdd={addNote} />
      <div className="note-area">
        {notes.map((noteItem, index) => {
          return (
            <Note
              key={noteItem.id}
              id={noteItem.id}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
              onEdit={editNote}
              chatbot={chatbot}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
              chatBodyRef={chatBodyRef}
              showChatbot={showChatbot}
            />
          );
        })}
        <Chatbot
          showChatbot={showChatbot}
          chatbot={chatbot}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
          chatBodyRef={chatBodyRef}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Main;
