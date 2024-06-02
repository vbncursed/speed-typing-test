CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    wpm INTEGER NOT NULL,
    accuracy DECIMAL(5, 2) NOT NULL,
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    language VARCHAR(10) NOT NULL
);