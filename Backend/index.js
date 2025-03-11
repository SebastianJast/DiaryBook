import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import env from "dotenv";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(cors());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

//Get all notes
app.get("/all/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query("SELECT * FROM my_notes WHERE user_id = $1", [
      id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get a random notes
app.get("/random", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM my_notes");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No notes available" });
    }
    const randomIndex = Math.floor(Math.random() * result.rows.length);
    res.json(result.rows[randomIndex]);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Post a new note
app.post("/notes/:id", authenticateToken, async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      "INSERT INTO my_notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *;",
      [title, content, id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete a note
app.delete("/notes/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      "DELETE FROM my_notes WHERE id = $1 RETURNING *;",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Edit a note
app.put("/notes/:id", authenticateToken, async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      "UPDATE my_notes SET title = $1, content = $2 WHERE id = $3 RETURNING *;",
      [title, content, id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Register
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Email already exists. Try logging in." });
    }
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [username, email, hash]
    );
    const user = result.rows[0];
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "15m",
    });
    return res.status(200).json({
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const loginPassword = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashPassword = user.password;
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "15m",
      });
      const match = await bcrypt.compare(loginPassword, storedHashPassword);
      if (!match) {
        return res.status(401).json({ error: "Incorrect Password" });
      } else {
        return res.status(200).json({
          token,
        });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
