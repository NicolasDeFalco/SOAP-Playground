# **SOAP Playground**

This project has for aim to try out the SOAP protocole and get a better a better understanding of it.

## Prerequisites

To run this project, you will need:

- [Node.js](https://nodejs.org/en/download)
- [PostgreSQL](https://www.postgresql.org/download/)

## Setup the projects

Before running the project, you need to create the database.
You can create a database by simply using this SQL query:

```sql
CREATE DATABASE soap-test
```


Once you've created the database, you need to create the table where our data will be stored.
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  about VARCHAR(500),
  price FLOAT
);

CREATE TABLE publisher (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
  location VARCHAR(100)
);
```
Then, you will need to specify your credentials in the environement variables (`.env`). (An exemple should be provided in the project(see `.env.exemple`))

## Running the project
To run the project, simply run `npm install` to retreive all the packages.

When it's done, run the project with the command `npx run ./server.js`.

To run the tests, you can run the command `node ./test/client.js` or `node ./test/publisher.js`.

## Todo list

Here are some of the feature i'd like to try and implement in my project:

- ✔ Basic implementation (GET, POST, PATCH, DELETE)
- ✔ Create other service in other files
- ✔ Multiple files for the server to seperate endpoint for every entity
- ✖ Try out tables with foreign keys (One to One, Many to Many,...)


