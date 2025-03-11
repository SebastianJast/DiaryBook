import React from "react";
import "../styles/footer.css"

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>Copyright SJ ⓒ {year}</p>
    </footer>
  );
}

export default Footer;
