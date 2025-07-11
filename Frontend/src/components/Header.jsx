import React from "react";
import "../styles/header.css"
import HighlightIcon from "@mui/icons-material/Highlight";
import Logout from "./Logout";

function Header(props) {
  return (
    <header>
      <h1>
        <HighlightIcon />
        DiaryBook
      </h1>
      <Logout logout={props.logout} />
    </header>
  );
}

export default Header;
