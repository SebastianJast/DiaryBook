CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT UNIQUE, 
    password TEXT
)

CREATE TABLE my_notes (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT, 
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
)