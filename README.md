# Signup Website
A simple website I made for some friends that wanted to create an organization that works for better public transport.

## Overview
Built with Node.js and Express, it features a secure signup form, user authentication, and data validation to ensure a seamless and safe experience.

## Features
- Secure user authentication with JSON Web Tokens (JWT) and Passport.
- Password hashing with bcrypt for enhanced security.
- Input validation with express-validator to prevent malicious data entry.
- Templating with EJS for dynamic content rendering.

## Getting Started
### Prerequisites
- Node.js

### Installation
Clone the repository and install dependencies:
git clone https://github.com/sturla-freyr/straetoFelag.git
cd straetoFelag
npm install

### Running the Application
- To run in development mode with hot reload:
- npm run dev

- To start the server:
- npm run start

### Environment Setup
Create a `.env` file in the root directory and populate it with your environment variables, including database credentials and JWT secret.

## License
This project is licensed under the ISC License.
