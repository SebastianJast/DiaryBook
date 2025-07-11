import React, { useState } from "react";
import "../styles/note.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function Note(props) {
  const [displayForm, setForm] = useState(false);
  const [note, setNote] = useState({
    title: props.title,
    content: props.content,
  });

  function handleClick() {
    props.onDelete(props.id);
  }

  function handleForm(event) {
    setForm((prevValue) => {
      return !prevValue;
    });
    event.preventDefault();
  }

  function changeEdit(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    props.onEdit(props.id, note.title, note.content);
    event.preventDefault();
    setForm((prevValue) => {
      return !prevValue;
    });
  }

  return (
      <div className="note">
        <form
          className={displayForm ? "edit-note show" : "edit-note hide"}
          id="edit-note"
        >
          <input onChange={changeEdit} name="title" value={note.title} />
          <textarea onChange={changeEdit} name="content" value={note.content} />
        </form>
        <div className={displayForm ? "hide" : "show"}>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
        </div>
         <button onClick={handleClick}>
          <DeleteOutlineIcon />
        </button>
         <button onClick={props.chatbot}>
          <ChatBubbleOutlineIcon />
        </button>
        <button
          className={displayForm ? "show" : "hide"}
          type="sumbit"
          form="edit-note"
        >
          <AddIcon onClick={handleSubmit} />
        </button>
        <button className={displayForm ? "hide" : "show"} onClick={handleForm}>
          <EditIcon />
        </button>
      </div>
  );
}

export default Note;
