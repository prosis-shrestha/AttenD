DROP TABLE IF EXISTS user_stall_interactions;
DROP TABLE IF EXISTS "Stall";
DROP TABLE IF EXISTS "User";

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    number VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    code INTEGER UNIQUE NOT NULL
);

-- Create Stall table
CREATE TABLE IF NOT EXISTS "Stall" (
    id SERIAL PRIMARY KEY,
    stall_name VARCHAR(255) NOT NULL,
    stall_desc TEXT,
    stall_dept VARCHAR(255),
    stall_img TEXT
);

-- Create user_stall_interactions table
CREATE TABLE IF NOT EXISTS user_stall_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(id),
    stall_id INTEGER REFERENCES "Stall"(id),
    is_liked BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stall_id)
);