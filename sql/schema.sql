CREATE TABLE registries (
    id serial PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    kennitala VARCHAR(10),
    email VARCHAR(64),
    address VARCHAR(128),
    phoneNr VARCHAR(32)
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(256) NOT NULL,
    admin BOOLEAN DEFAULT false
);