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

function Main() {
  const [notes, setNotes] = useState([]);
  const [alert, setAlert] = useState(false);
  const { token, setToken } = useToken();
  const [userId, setUserId] = useState();

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
            />
          );
        })}
      </div>
      <Footer />
    </div>
  );
}

export default Main;
