CREATE TABLE registries (
    id serial PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    kennitala VARCHAR(10),
    email VARCHAR(64),
    address VARCHAR(64),
    phoneNr VARCHAR(32)
);