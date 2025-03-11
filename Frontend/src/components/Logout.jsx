import React from "react";
import "../styles/logout.css";

function Logout(props) {
  function handleClick() {
    props.logout();
  }

  return (
    <div className="btn-logout">
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default Logout;
