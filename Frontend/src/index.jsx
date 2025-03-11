// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./components/App";

// ReactDOM.render(<App />, document.getElementById("root"));

import App from "./components/App";
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App tab="home" />);

// If you're running this locally in VS Code use the commands:
// npm install
// to install the node modules and
// npm run dev
// to launch your react project in your browser
